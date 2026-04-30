import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai = null;
try {
  if (geminiApiKey && geminiApiKey !== 'your_gemini_key_here') {
    ai = new GoogleGenAI({ apiKey: geminiApiKey });
  }
} catch (error) {
  console.warn("Failed to initialize Gemini for translation fallback:", error);
}

// Persistent cache for translations
const CACHE_KEY = 'votewise_translations_v2';
let cache = {};
try {
  const saved = localStorage.getItem(CACHE_KEY);
  if (saved) {
    cache = JSON.parse(saved);
  }
} catch (e) {
  console.warn("Failed to load translation cache", e);
}

function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Failed to save translation cache", e);
  }
}

/**
 * Translate a single string using the free Google Translate web endpoint.
 * This does NOT require an API key.
 */
async function freeTranslateSingle(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Free translate HTTP ${res.status}`);
  const data = await res.json();
  // data[0] is an array of [translatedSegment, originalSegment, ...]
  // Concatenate all translated segments
  return data[0].map(segment => segment[0]).join('');
}

/**
 * Translate an array of strings using the free Google Translate endpoint.
 * We batch by joining with a separator and splitting after.
 */
async function freeTranslateBatch(texts, targetLang) {
  const SEPARATOR = '\n\n###SPLIT###\n\n';
  const CHUNK_SIZE = 20; // Keep chunks small for URL length limits
  const results = [];

  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    const chunk = texts.slice(i, i + CHUNK_SIZE);
    try {
      const joined = chunk.join(SEPARATOR);
      const translated = await freeTranslateSingle(joined, targetLang);
      // Split back using the separator (Google Translate usually preserves it)
      const parts = translated.split(/\s*###\s*SPLIT\s*###\s*/i);
      
      if (parts.length === chunk.length) {
        results.push(...parts.map(p => p.trim()));
      } else {
        throw new Error("Split length mismatch");
      }
    } catch (err) {
      console.warn("Free translate chunk failed:", err);
      throw err;
    }
    // Small delay to avoid rate limiting
    if (i + CHUNK_SIZE < texts.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  return results;
}

/**
 * Translates an array of strings into the target language.
 * Priority: 1) Google Cloud Translation API (paid key)
 *           2) Free Google Translate endpoint (no key needed)
 *           3) Gemini AI (if quota available)
 */
export const translateStrings = async (texts, targetLanguage) => {
  if (!texts || texts.length === 0) return [];
  if (targetLanguage === 'en') return texts; // English is our base language

  // Check cache for each text
  const cachedResults = [];
  const uncachedTexts = [];
  const uncachedIndices = [];

  texts.forEach((text, index) => {
    // Only translate if text exists
    if (!text) {
      cachedResults[index] = text;
      return;
    }
    
    // Safety check for empty strings or purely whitespace
    if (text.trim() === '') {
      cachedResults[index] = text;
      return;
    }

    const cacheKey = `${text}__${targetLanguage}`;
    if (cache[cacheKey]) {
      cachedResults[index] = cache[cacheKey];
    } else {
      uncachedTexts.push(text);
      uncachedIndices.push(index);
    }
  });

  // If everything was cached, return immediately
  if (uncachedTexts.length === 0) {
    return cachedResults;
  }

  // 0) Try fetching pre-generated static translation file (0ms instant switching)
  let staticDict = null;
  try {
    const res = await fetch(`/locales/${targetLanguage}.json`);
    if (res.ok) {
      staticDict = await res.json();
    }
  } catch (e) {
    // File doesn't exist or fetch failed
  }

  const remainingTexts = [];
  const remainingIndices = [];

  uncachedTexts.forEach((text, i) => {
    const originalIndex = uncachedIndices[i];
    
    // Accept from staticDict if it exists and is different from English (to allow API fallback for unsupported langs)
    if (staticDict && staticDict[text] && staticDict[text] !== text) {
      const translated = staticDict[text];
      cachedResults[originalIndex] = translated;
      cache[`${text}__${targetLanguage}`] = translated;
    } else {
      // Missing from static file, or equal to English (meaning generation failed), need API translation
      remainingTexts.push(text);
      remainingIndices.push(originalIndex);
    }
  });

  // If we found everything in the static JSON, return immediately!
  if (remainingTexts.length === 0) {
    saveCache();
    return cachedResults;
  }

  // Otherwise, proceed to translate ONLY the remainingTexts via API

  try {
    let translations = [];

    // Method 1: Google Cloud Translation API (paid, if key is available)
    if (apiKey) {
      const response = await fetch(`${API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: remainingTexts,
          target: targetLanguage,
          source: 'en',
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      translations = data.data.translations.map(t => t.translatedText);
    } else if (ai) {
      // Method 2: Gemini AI (Primary if paid API key is missing)
      console.log("Using Gemini AI for batch translation...");
      translations = [];
      const CHUNK_SIZE = 100; // Increased chunk size to reduce total network requests
      const chunkPromises = [];
      
      for (let i = 0; i < remainingTexts.length; i += CHUNK_SIZE) {
        const chunk = remainingTexts.slice(i, i + CHUNK_SIZE);
        
        chunkPromises.push((async () => {
          try {
            const prompt = `Translate the following JSON array of English strings into the language code '${targetLanguage}'. 
Return ONLY a valid JSON array of strings in the exact same length and order. Do not include markdown formatting.
Ensure civic/election terminology is correctly localized.
Array to translate:
${JSON.stringify(chunk)}`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                temperature: 0.1,
                responseMimeType: "application/json",
              }
            });
            
            let responseText = response.text;
            
            if (responseText.startsWith('```')) {
              responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
            }
            
            const chunkTranslations = JSON.parse(responseText);
            
            if (!Array.isArray(chunkTranslations) || chunkTranslations.length !== chunk.length) {
               throw new Error("Invalid array length for chunk");
            }
            return chunkTranslations;
          } catch (err) {
            console.warn("Gemini chunk translation failed, trying Free Translate fallback...", err);
            try {
               const freeTranslations = await freeTranslateBatch(chunk, targetLanguage);
               return freeTranslations;
            } catch (freeErr) {
               console.error("Free translate fallback also failed", freeErr);
               return chunk;
            }
          }
        })());
      }
      
      // Execute all chunk requests concurrently for massive speedup
      const chunkResults = await Promise.all(chunkPromises);
      translations = chunkResults.flat();
    } else {
      // Method 3: Free Google Translate endpoint (No Gemini, No Paid Key)
      console.log("Using free Google Translate endpoint...");
      try {
        translations = await freeTranslateBatch(remainingTexts, targetLanguage);
      } catch (freeErr) {
        console.error("Free translate failed", freeErr);
        translations = [...remainingTexts];
      }
    }

    // Repopulate cache and results
    translations.forEach((translatedText, i) => {
      const originalText = remainingTexts[i];
      const originalIndex = remainingIndices[i];
      
      const cacheKey = `${originalText}__${targetLanguage}`;
      cache[cacheKey] = translatedText;
      
      cachedResults[originalIndex] = translatedText;
    });

    saveCache();

    return cachedResults;
  } catch (error) {
    console.error("Translation failed:", error);
    // On failure, return English for the uncached portions silently
    remainingIndices.forEach((originalIndex, i) => {
      cachedResults[originalIndex] = remainingTexts[i];
    });
    return cachedResults;
  }
};
