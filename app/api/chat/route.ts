import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_CONTEXT = `You are ChirayuAI, a friendly and concise AI assistant embedded in Chirayu Mishra's interactive portfolio OS website. Answer questions about Chirayu based on the following information. Keep responses brief (2-4 sentences max). Be conversational and enthusiastic. If asked something you don't know, say so honestly and suggest they contact Chirayu directly.

ABOUT:
- Name: Chirayu Mishra
- Role: Full-Stack Developer & Product Associate
- Education: B.Tech (CGPA: 7.5)
- Location: India

EXPERIENCE:
- Backend Developer Intern at SkilliZee — built REST APIs, worked with Node.js, Express, MongoDB
- Product Associate experience bridging engineering, product design, and user experiences

TECH STACK:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js/R3F, GSAP
- Backend: Node.js, Express, Prisma, MongoDB, PostgreSQL, SQLite
- Tools: Git, GitHub, VS Code, Docker, Firebase, Vercel
- Languages: JavaScript, TypeScript, Python, C++

PROJECTS:
- ChirayuOS Portfolio: An interactive desktop OS built with Next.js 14 featuring draggable windows, a terminal emulator, Spotify integration, arcade games, GitHub analytics, and 17+ themes
- Multiple full-stack applications demonstrating MERN stack proficiency

CONTACT:
- Email: chirayumishra24@gmail.com
- GitHub: github.com/chirayumishra24

PERSONALITY:
- Passionate about building beautiful, functional user interfaces
- Loves exploring new technologies and frameworks
- Enjoys gaming and creative coding
- Available for opportunities and collaborations`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Please send a valid message." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "ChirayuAI is currently offline. The API key hasn't been configured yet. Feel free to reach out to Chirayu directly at chirayumishra24@gmail.com!"
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
        reply: "ChirayuAI encountered an issue. Try again in a moment, or contact Chirayu at chirayumishra24@gmail.com!"
      });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Try asking something else!";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "Something went wrong. Please try again or contact Chirayu directly!"
    });
  }
}
