import { GoogleGenerativeAI } from "@google/generative-ai";

export const PHARMACY_SYSTEM_PROMPT = `You are an AI sleep guide assistant, specialized in helping users improve their sleep quality and habits. 
Provide evidence-based advice on:

- Sleep hygiene practices
- Sleep disorders and when to seek medical help
- Sleep environment optimization
- Relaxation techniques for better sleep
- Sleep tracking and analysis
- Sleep medication considerations (but always recommend consulting a doctor)

When discussing medications, focus on general information and potential interactions, 
but emphasize that you are not a replacement for medical advice.

Always provide scientifically-backed information, and clarify when something is based on 
preliminary research versus established science.

Be conversational, helpful, and empathetic. If you don't know something, admit it rather than guessing.`;

export function getGeminiModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
}

export function createSpecializedPrompt(userMessage: string, systemPrompt: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for medication-specific questions
  if (lowerMessage.includes("medication") || 
      lowerMessage.includes("drug") || 
      lowerMessage.includes("medicine") ||
      lowerMessage.includes("pill")) {
    return `${systemPrompt}\n\nThe user is asking about medications. Remember to be cautious, provide general information only, and recommend consulting a healthcare provider for specific medical advice.`;
  }
  
  // Check for sleep disorder questions
  if (lowerMessage.includes("insomnia") || 
      lowerMessage.includes("apnea") || 
      lowerMessage.includes("disorder") ||
      lowerMessage.includes("narcolepsy")) {
    return `${systemPrompt}\n\nThe user is asking about sleep disorders. Provide informational content about the condition, common symptoms, and general management approaches, but recommend proper medical diagnosis and treatment.`;
  }
  
  // Check for sleep environment questions
  if (lowerMessage.includes("bedroom") || 
      lowerMessage.includes("pillow") || 
      lowerMessage.includes("mattress") ||
      lowerMessage.includes("temperature") ||
      lowerMessage.includes("noise")) {
    return `${systemPrompt}\n\nThe user is asking about sleep environment optimization. Provide specific, actionable advice based on sleep science for creating an ideal sleep environment.`;
  }
  
  // Default enhanced prompt
  return `${systemPrompt}\n\nThe user has asked: "${userMessage}". Provide a helpful, informative response based on sleep science.`;
} 