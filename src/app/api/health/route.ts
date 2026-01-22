import { NextResponse } from 'next/server';
import { checkOllamaHealth } from '@/lib/ollama/healthCheck';
import { getOllamaConfig } from '@/lib/ollama/client';

export async function GET() {
  const health = await checkOllamaHealth();
  const config = getOllamaConfig();

  if (health.ok) {
    return NextResponse.json({
      status: 'ok',
      ollama: {
        available: true,
        model: config.model,
        baseUrl: config.baseUrl,
      },
    });
  }

  return NextResponse.json(
    {
      status: 'error',
      ollama: {
        available: false,
        error: health.error,
        instructions: health.instructions,
      },
    },
    { status: 503 }
  );
}

export const dynamic = 'force-dynamic';
