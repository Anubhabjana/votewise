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

export const getGeminiResponse = async (chatHistory, userMessage, isFirstTimer = false) => {
  if (!ai) {
    throw new Error("Gemini API key is missing or not configured correctly in .env.");
  }

  let systemInstruction = `You are VoteWise, an AI-powered election process education assistant. 
Your goal is to help citizens understand the Indian election process, voting eligibility rules (Form 6, EPIC), and important deadlines.
Keep your answers concise, structured, and informative. 
If asked in Hindi, reply in Hindi. If asked in English, reply in English.
Do not provide political opinions, predict election outcomes, or endorse any party.
Only answer questions related to civic education and election procedures.`;

  if (isFirstTimer) {
     systemInstruction += "\n\nCRITICAL: The user has 'Beginner Friendly' mode enabled. You MUST respond in extremely simple, jargon-free language suitable for a young first-time voter. Break down any complex terms (like EVM, VVPAT, Form 6) into basic analogies.";
  }

  try {
    // Format the conversation history for the model
    // The @google/genai SDK accepts an array of strings or objects for contents.
    // For a simple chat, we can combine the history into a single prompt context,
    // or use the 'contents' array structure if supported.
    
    let conversationText = chatHistory.map(msg => `${msg.role === 'user' ? 'Citizen' : 'VoteWise'}: ${msg.content}`).join('\n');
    conversationText += `\nCitizen: ${userMessage}\nVoteWise:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Couldn\'t connect to the assistant. Please try again later.');
  }
};
