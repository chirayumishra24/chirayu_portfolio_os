import { NextResponse } from "next/server";
import { aiAssistantContext, profile } from "../../../data/portfolio";

export const dynamic = "force-dynamic";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const SYSTEM_CONTEXT = `You are ChirayuAI, a concise assistant embedded in ${profile.name}'s interactive portfolio OS. Answer only from the information below. Keep responses brief (2-4 sentences). If asked something that is not in the context, say you do not have that detail and suggest contacting Chirayu directly.

${aiAssistantContext}`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please send a valid message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `ChirayuAI is currently offline because the API key is not configured. You can contact Chirayu directly at ${profile.email}.`
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
            { role: "model", parts: [{ text: "Understood! I'm ChirayuAI, ready to answer questions about Chirayu Mishra. Ask me anything!" }] },
            { role: "user", parts: [{ text: message }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
            topP: 0.9,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", response.status, errorData);
      return NextResponse.json({
        reply: `ChirayuAI encountered an issue. Try again in a moment, or contact Chirayu at ${profile.email}.`
      });
    }

    const data = await response.json() as GeminiResponse;
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Try asking something else!";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: `Something went wrong. Please try again or contact Chirayu directly at ${profile.email}.`
    });
  }
}
