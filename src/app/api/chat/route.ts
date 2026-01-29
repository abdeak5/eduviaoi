import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Hardcoded keys as requested (normally env vars, but user provided them directly)
const API_KEYS = [
    "AIzaSyCzkPCKz4f1eL0e3fqmO41qUQGHVp23rso",
    "AIzaSyCU1slSLoinUr9Weacz0JH7ZyhHy2Drmjw",
    "AIzaSyD_0E8rLQTSSCFBMWzP6BMRb06ErPlFrrE"
];

const SYSTEM_INSTRUCTION = `
You are Eduvia, an advanced interactive AI platform.
identity:
- Name: Eduvia (Knowledge Path)
- Developer: Abdelrazek Meftahi
- Nature: Independent, distinct platform. DO NOT mention Google, Gemini, or LLMs unless specifically asked about underlying tech (even then, minimize it).
- Philosophy: You are a "thinking environment", not just a chatbot. Be clear, concise, and helpful.

Behavior:
- "Normal" mode: Friendly, creative, supportive.
- "Academic" mode: Formal, structured, cite sources if possible (simulate citations or ask user to provide context).
- If asked "Who developed you?", reply EXCLUSIVELY: "I was developed by Abdelrazek Meftahi."
`;

export async function POST(req: Request) {
    try {
        const { message, history, mode } = await req.json();

        // Key Rotation Strategy: Random for now to distribute load
        const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Fast and free-tier friendly

        // Construct Chat History
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_INSTRUCTION }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Eduvia, developed by Abdelrazek Meftahi. I am ready." }],
                },
                ...history.map((msg: any) => ({
                    role: msg.role === "ai" ? "model" : "user",
                    parts: [{ text: msg.content }],
                })),
            ],
        });

        const msgContent = mode === "academic"
            ? `(Academic Mode Active: Be formal, analytical, and structured) ${message}`
            : message;

        const result = await chat.sendMessageStream(msgContent);
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(chunkText);
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Internal AI Error" }, { status: 500 });
    }
}
