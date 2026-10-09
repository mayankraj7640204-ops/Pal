import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const { query, cachedChatLog } = await req.json();

    if (!cachedChatLog) {
      return NextResponse.json({ error: 'No chat log uploaded yet. Please upload a chat log first.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: "You are SAAR, a local chat assistant. Answer the user's question strictly based on the provided chat log. If the answer is not in the log, say 'I cannot find that in the current chat log.' Do not make up information.",
    });

    const prompt = `Chat Log:\n${cachedChatLog}\n\nUser Question: ${query}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Error in Ask SAAR:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
