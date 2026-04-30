import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UI_STRINGS } from '../src/constants/uiStrings.js';
import { LANGUAGES } from '../src/constants/languages.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDmfxIE4zvXCG7pXdMFOpkNnpoBMBLu_7k' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, '../public/locales');

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

/**
 * Translate a single string using the free Google Translate web endpoint.
 */
async function freeTranslateSingle(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Free translate HTTP ${res.status}`);
  const data = await res.json();
  return data[0].map(segment => segment[0]).join('');
}

/**
 * Translate an array of strings using the free Google Translate endpoint by translating each string individually.
 * This completely avoids any chunk splitting errors caused by Google Translate mangling separators.
 */
async function freeTranslateBatch(texts, targetLang) {
  const results = new Array(texts.length).fill(null);
  
  // We'll process in small batches of concurrent requests to be polite
  const CONCURRENCY = 15; 
  let currentIndex = 0;
  
  const worker = async () => {
    while (true) {
      const index = currentIndex++;
      if (index >= texts.length) break;
      
      const text = texts[index];
      
      // If it's empty, just copy it over
      if (!text || text.trim() === '') {
        results[index] = text;
        continue;
      }
      
      try {
        const translated = await freeTranslateSingle(text, targetLang);
        results[index] = translated;
      } catch (err) {
        console.log(`Failed to translate string [${index}] for ${targetLang}:`, err.message);
        results[index] = text; // fallback to English
      }
    }
  };
  
  // Create workers
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  
  await Promise.all(workers);
  
  return results;
}

async function main() {
  const texts = UI_STRINGS;
  console.log(`Found ${texts.length} strings to translate.`);
  
  // Create an English base file
  const enDict = {};
  texts.forEach(text => { enDict[text] = text; });
  fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(enDict, null, 2));

  // Process all languages
  for (const lang of LANGUAGES) {
    if (lang.code === 'en') continue;
    const filePath = path.join(localesDir, `${lang.code}.json`);
    
    // Skip if already generated and looks valid (size > 20000 means it's not just english fallback)
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 22000) {
         console.log(`Skipping ${lang.name} (${lang.code}), already valid.`);
         continue;
      }
    }
    
    console.log(`Translating to ${lang.name} (${lang.code})...`);
    try {
      const translated = await freeTranslateBatch(texts, lang.code);
      const dict = {};
      texts.forEach((text, i) => {
         dict[text] = translated[i];
      });
      fs.writeFileSync(filePath, JSON.stringify(dict, null, 2));
      console.log(`Saved ${lang.code}.json`);
    } catch (e) {
      console.error(`Error translating ${lang.code}:`, e);
    }
    
    // Google Translate Free endpoint doesn't need 8 second delays, just 1 second to be safe
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("Done generating locale files!");
}

main();
