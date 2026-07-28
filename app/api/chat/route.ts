import { NextResponse } from "next/server";
import { aiAssistantContext, profile } from "../../../data/portfolio";

export const dynamic = "force-dynamic";

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const SYSTEM_CONTEXT = `You are ChirayuAI, a concise assistant embedded in ${profile.name}'s interactive portfolio OS. Answer only from the information below. Keep responses brief (2-4 sentences). If asked something that is not in the context, say you do not have that detail and suggest contacting Chirayu directly.

${aiAssistantContext}`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ reply: "Please send a valid message." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: `ChirayuAI is currently offline because the GROQ_API_KEY is not configured in environment variables. You can contact Chirayu directly at ${profile.email}.`
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_CONTEXT },
          { role: "user", content: message.trim() }
        ],
        temperature: 0.7,
        max_tokens: 256
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", response.status, errorData);
      return NextResponse.json({
        reply: `ChirayuAI encountered an issue communicating with Groq API. Try again in a moment, or contact Chirayu at ${profile.email}.`
      });
    }

    const data = (await response.json()) as GroqResponse;
    const reply = data?.choices?.[0]?.message?.content || "I couldn't generate a response. Try asking something else!";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: `Something went wrong. Please try again or contact Chirayu directly at ${profile.email}.`
    });
  }
}

