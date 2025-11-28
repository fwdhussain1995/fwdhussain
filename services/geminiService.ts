import { GoogleGenAI, Type } from "@google/genai";
import { AIReviewResult } from "../types";

// Initialize the API client
// Note: In a real production app, you might want to proxy these requests or use a more robust backend pattern.
// For this demo, we use the process.env.API_KEY directly as instructed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

export const summarizePaper = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Summarize the following academic paper content in a concise abstract-like paragraph (max 150 words). Focus on the problem, method, and results.\n\n${text}`,
      config: {
        systemInstruction: "You are an expert academic editor.",
        temperature: 0.3,
      }
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Summary error:", error);
    return "Failed to generate summary. Please check your API key.";
  }
};

export const reviewPaper = async (text: string): Promise<AIReviewResult> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Perform a brief peer review of the following paper text. 
      Identify strengths, weaknesses, and provide an overall quality score out of 10.
      
      Paper Text:
      ${text.substring(0, 10000)} ... [truncated]`,
      config: {
        systemInstruction: "You are a critical academic peer reviewer.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Brief summary of the paper's contribution" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key strengths" },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of areas for improvement" },
            score: { type: Type.NUMBER, description: "Overall quality score from 1-10" }
          },
          required: ["summary", "strengths", "weaknesses", "score"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIReviewResult;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Review error:", error);
    return {
      summary: "Error generating review.",
      strengths: [],
      weaknesses: ["Service unavailable or API Error"],
      score: 0
    };
  }
};

export const chatWithPaper = async (
  currentMessage: string, 
  paperContent: string, 
  history: { role: 'user' | 'model', text: string }[]
): Promise<string> => {
  try {
    // We construct a chat session manually or use the Chat API. 
    // Given we want to inject the paper content as context effectively for each turn (or once at start),
    // let's use the Chat API but prepend the context in the system instruction or first message.
    
    // Convert history to format expected by Chat (if we were persisting session object).
    // Here we will use stateless generateContent for simplicity to ensure context is always fresh,
    // or we can use a fresh chat instance. Let's use `generateContent` with full history for maximum control in this stateless service function.
    
    const contextPrompt = `
      Context: You are an intelligent research assistant helping a user understand the following academic paper.
      Answer the user's questions based strictly on the paper content provided below. If the answer is not in the paper, say so.
      
      --- PAPER START ---
      ${paperContent.substring(0, 20000)}
      --- PAPER END ---
    `;

    // Construct the full prompt history
    const contents = [
      { role: 'user', parts: [{ text: contextPrompt + "\n\nHello, I'm ready to ask questions." }] },
      { role: 'model', parts: [{ text: "I have read the paper. What would you like to know?" }] },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: currentMessage }] }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: contents,
    });

    return response.text || "I couldn't understand that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the AI service right now.";
  }
};

export const improveWriting = async (text: string, type: 'grammar' | 'clarity' | 'academic'): Promise<string> => {
  try {
    let instruction = "";
    switch(type) {
      case 'grammar': instruction = "Fix grammar and spelling errors. Maintain the original tone."; break;
      case 'clarity': instruction = "Rewrite for clarity and conciseness. Make it easier to read."; break;
      case 'academic': instruction = "Rewrite using formal academic language suitable for a high-impact journal."; break;
    }

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Rewrite the following text:\n\n${text}`,
      config: {
        systemInstruction: instruction,
      }
    });
    return response.text || text;
  } catch (error) {
    return text; // Return original on error
  }
}
