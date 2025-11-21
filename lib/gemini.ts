import { GoogleGenAI } from '@google/genai';

// IMPORTANT: Do not expose the API_KEY in the frontend. 
// This is done here for simplicity in this specific project context.
// In a real-world application, this should be handled via a backend proxy.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a friendly message to the user.
  console.error("API_KEY is not set. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function runGemini(model: 'gemini-3-pro-preview' | 'gemini-2.5-flash', prompt: string): Promise<string> {
    if (!ai) {
        return "AI features are unavailable. Please configure your API key.";
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        const text = response.text;
        
        if (text) {
            // Clean up potential markdown formatting if we expect plain text
            return text.replace(/```(json)?/g, '').trim();
        }
        
        return "Sorry, the AI couldn't generate a response. Please try again.";
    } catch (error) {
        console.error(`Error running Gemini with model ${model}:`, error);
        return "An error occurred while communicating with the AI. Please check the console for details.";
    }
}

export function isGeminiAvailable(): boolean {
    return !!ai;
}
