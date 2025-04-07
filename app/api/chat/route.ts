import { getGeminiModel, PHARMACY_SYSTEM_PROMPT, createSpecializedPrompt } from "@/lib/api-config"
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: Message[] }

    // Use system prompt without user context (simplified version)
    let enhancedSystemPrompt = PHARMACY_SYSTEM_PROMPT

    // Get user's last message
    const userLastMessage = messages[messages.length - 1].content.toString()
    
    // Create a specialized prompt based on the query type
    const specializedPrompt = createSpecializedPrompt(userLastMessage, enhancedSystemPrompt)

    // Get the Gemini model
    const model = getGeminiModel()

    // Send request to Gemini
    try {
      // Format messages for Gemini 1.5 Pro API
      const formattedMessages = [
        { role: "user", parts: [{ text: specializedPrompt }] },
        ...messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ];

      // Use the generateContentStream method with enhanced parameters
      const result = await model.generateContentStream({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.3, // Lower temperature for more reliable responses
          maxOutputTokens: 4000, // Increased token limit for Gemini 1.5 Pro
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          }
        ]
      });

      // Create a simple text stream
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (error: any) {
            console.error("Error in stream processing:", error);
            controller.error(error);
          }
        }
      });

      // Return as streaming response
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    } catch (err: any) {
      console.error("Gemini API error:", err)
      // Check if this is an API key error
      if (err.message && err.message.includes("API key not valid")) {
        return new Response(JSON.stringify({ 
          error: "Invalid API key. Please update your GEMINI_API_KEY in .env.local file."
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
      
      // Check for model availability issues
      if (err.message && (
        err.message.includes("model not found") || 
        err.message.includes("not supported") ||
        err.message.includes("not available"))) {
        
        return new Response(JSON.stringify({ 
          error: "Gemini 1.5 Pro is not available. Please try again with a different model or check your API key permissions."
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
      }
      
      throw err;
    }
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ 
      error: error.message || "An error occurred processing your request"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
} 