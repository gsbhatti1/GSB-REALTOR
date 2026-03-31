import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    GROQ: process.env.GROQ_API_KEY ? `set (${process.env.GROQ_API_KEY.slice(0,8)}...)` : 'NOT SET',
    OPENAI: process.env.OPENAI_API_KEY ? 'set' : 'NOT SET',
    GEMINI: process.env.GEMINI_API_KEY ? 'set' : 'NOT SET',
  })
}
