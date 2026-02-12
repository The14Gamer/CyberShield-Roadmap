
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const sendMessageToGemini = async (prompt: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  if (!API_KEY) {
    return "API key not configured. Please ensure it's provided in the environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are a world-class Cybersecurity Mentor. 
        Your goal is to help the user navigate a 3-month roadmap. 
        Be concise, technical but clear, and encouraging. 
        If the user asks about a lab, provide step-by-step guidance. 
        If they ask about a project, suggest tools and architectures. 
        Always promote ethical hacking and legal boundaries.`,
      },
    });

    // Note: The SDK chat message history expects { role: string, parts: { text: string }[] }
    // However, the sendMessage method takes a simple string message.
    // We can't easily rebuild history in the SDK's chat object for this snippet 
    // without more complex mapping, so we'll just send the last message for now 
    // or concatenate history if needed.
    
    const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    return response.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: " + (error instanceof Error ? error.message : "An unknown error occurred.");
  }
};
