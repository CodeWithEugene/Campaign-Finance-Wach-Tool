import { NextRequest, NextResponse } from 'next/server';
import {
  CHATBOT_KNOWLEDGE,
  CHATBOT_GREETING,
  CHATBOT_FALLBACK,
} from '@/lib/chatbotKnowledge';

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();
  if (!lower) return CHATBOT_GREETING;

  for (const entry of CHATBOT_KNOWLEDGE) {
    const matches = entry.keywords.some((kw) => lower.includes(kw));
    if (matches) {
      let answer = entry.answer;
      if (answer === '__GREETING__') answer = CHATBOT_GREETING;
      return answer;
    }
  }

  return CHATBOT_FALLBACK;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastUser = messages.filter((m: { role?: string }) => m.role === 'user').pop();
    const userContent = lastUser?.content ?? '';
    const reply = getResponse(userContent);
    return NextResponse.json({ content: reply });
  } catch {
    return NextResponse.json(
      { content: CHATBOT_FALLBACK },
      { status: 200 }
    );
  }
}
