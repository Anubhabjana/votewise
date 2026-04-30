import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai = null;

try {
  // Only initialize if it's not a placeholder
  if (apiKey && apiKey !== 'your_gemini_key_here') {
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
} catch (error) {
  console.warn("Failed to initialize Gemini:", error);
}

/**
 * Get a chatbot response from Gemini with optional Google Search grounding.
 */
export const getGeminiResponse = async (chatHistory, userMessage, isFirstTimer = false) => {
  if (!ai) {
    throw new Error("Gemini API key is missing or not configured correctly in .env.");
  }

  let systemInstruction = `You are VoteWise, an AI-powered election process education assistant. 
Your goal is to help citizens understand the Indian election process, voting eligibility rules (Form 6, EPIC), and important deadlines.
Keep your answers concise, structured, and informative. 
If asked in Hindi, reply in Hindi. If asked in English, reply in English.
Do not provide political opinions, predict election outcomes, or endorse any party.
Only answer questions related to civic education and election procedures.
When you have access to Google Search results, cite the source at the end of your response.`;

  if (isFirstTimer) {
     systemInstruction += "\n\nCRITICAL: The user has 'Beginner Friendly' mode enabled. You MUST respond in extremely simple, jargon-free language suitable for a young first-time voter. Break down any complex terms (like EVM, VVPAT, Form 6) into basic analogies.";
  }

  try {
    let conversationText = chatHistory.map(msg => `${msg.role === 'user' ? 'Citizen' : 'VoteWise'}: ${msg.content}`).join('\n');
    conversationText += `\nCitizen: ${userMessage}\nVoteWise:`;

    // Detect if query is about current/real-time information
    const needsGrounding = /when|next election|latest|current|2024|2025|2026|candidate|schedule|result|news|announce/i.test(userMessage);

    const config = {
      systemInstruction: systemInstruction,
      temperature: 0.3,
    };

    // Enable Google Search grounding for real-time queries
    if (needsGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationText,
      config
    });

    let text = response.text;
    
    // Extract grounding metadata if available
    let sources = [];
    try {
      const candidate = response.candidates?.[0];
      const grounding = candidate?.groundingMetadata;
      if (grounding?.groundingChunks) {
        sources = grounding.groundingChunks
          .filter(c => c.web)
          .map(c => ({ title: c.web.title, url: c.web.uri }))
          .slice(0, 3); // Max 3 sources
      }
    } catch (e) {
      // Grounding metadata may not always be present
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Couldn\'t connect to the assistant. Please try again later.');
  }
};

/**
 * Analyze a Voter ID card image using Gemini's multimodal capabilities.
 * Returns structured data extracted from the card.
 */
export const analyzeVoterID = async (imageBase64, mimeType = 'image/jpeg') => {
  if (!ai) {
    throw new Error("Gemini API key is missing or not configured correctly in .env.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert document analyzer. Analyze this ID card image and extract voter/citizen details.
              
Return a JSON object with these fields (use null if not found):
{
  "card_type": "string (e.g. 'Voter ID / EPIC', 'Aadhaar', 'Driving License', 'Other')",
  "name": "string",
  "father_or_husband_name": "string",
  "age_or_dob": "string",
  "gender": "string",
  "epic_number": "string (voter ID number if present)",
  "address": "string",
  "constituency": "string",
  "state": "string",
  "is_valid_voter_id": "boolean (true if this appears to be a valid Indian Voter ID / EPIC card)",
  "eligibility_summary": "string (brief assessment of voting eligibility based on visible info)",
  "tips": ["array of helpful tips based on the card, e.g. 'Your card appears valid', 'Consider updating your address if you have moved'"]
}`
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      }
    });

    let responseText = response.text;
    
    // Clean up markdown fences if present
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Voter ID Analysis Error:", error);
    throw new Error('Could not analyze the document. Please try with a clearer image.');
  }
};

/**
 * Generate a personalized Voter Readiness Report using structured output.
 */
export const generateReadinessReport = async (quizScore, quizTotal, eligibilityData, language = 'en') => {
  if (!ai) {
    throw new Error("Gemini API key is missing or not configured correctly in .env.");
  }

  try {
    const prompt = `Based on the following user data, generate a personalized Voter Readiness Report.

Quiz Performance: ${quizScore} out of ${quizTotal} correct
Eligibility Status: ${eligibilityData?.eligible ? 'Eligible' : 'Not yet eligible'}
${eligibilityData?.age ? `Age: ${eligibilityData.age}` : ''}
${eligibilityData?.message ? `Details: ${eligibilityData.message}` : ''}
Language: ${language}

Generate the report in ${language === 'en' ? 'English' : 'the language code: ' + language}.

Return a JSON object with:
{
  "readiness_score": number (0-100),
  "readiness_level": "string (Ready to Vote / Almost Ready / Needs Preparation)",
  "strengths": ["array of things the user knows well"],
  "knowledge_gaps": ["array of areas to improve"],
  "action_items": [
    {
      "action": "string",
      "priority": "high|medium|low",
      "url": "string (official URL if applicable, else null)"
    }
  ],
  "badge": "string (fun badge title like 'Democracy Champion 🏅' or 'Rising Voter 🌱')",
  "motivational_message": "string (1-2 sentence encouraging message)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      }
    });

    let responseText = response.text;
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Readiness Report Error:", error);
    throw new Error('Could not generate readiness report.');
  }
};
