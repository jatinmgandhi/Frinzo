import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateWordList = async (topic: string, count: number): Promise<string[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Cannot generate words.");
  }

  const model = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Generate a list of ${count} distinct English words related to the topic: "${topic}". 
      The words should be suitable for a Hangman game (single words, no spaces, no hyphens, length between 5 and 12 letters).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const words = JSON.parse(text);
    return words.map((w: string) => w.toUpperCase());
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};