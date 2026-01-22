import { NextRequest } from 'next/server';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { streamingChatNode } from '@/lib/graph/nodes/chatNode';
import { GraphStateAnnotation } from '@/types/graph';
import { checkOllamaHealth } from '@/lib/ollama/healthCheck';
import { createMessageId } from '@/types/thread';

interface ChatRequestBody {
  threadId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    // Check Ollama health first
    const health = await checkOllamaHealth();
    if (!health.ok) {
      return new Response(
        JSON.stringify({
          type: 'error',
          error: {
            code: 'OLLAMA_UNAVAILABLE',
            message: health.error || 'Ollama is not available',
          },
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse and validate request
    const body: ChatRequestBody = await req.json();

    if (!body.threadId || !body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({
          type: 'error',
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request body',
          },
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Convert messages to LangChain format
          const langchainMessages = body.messages.map((msg) =>
            msg.role === 'user'
              ? new HumanMessage(msg.content)
              : new AIMessage(msg.content)
          );

          const state: typeof GraphStateAnnotation.State = {
            messages: langchainMessages,
          };

          let fullContent = '';

          // Stream content chunks
          for await (const chunk of streamingChatNode(state)) {
            fullContent += chunk;
            const data = JSON.stringify({
              type: 'content',
              content: chunk,
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // Send completion event
          const doneData = JSON.stringify({
            type: 'done',
            message: {
              id: createMessageId(),
              role: 'assistant',
              content: fullContent,
              createdAt: Date.now(),
            },
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

          controller.close();
        } catch (error) {
          const errorData = JSON.stringify({
            type: 'error',
            error: {
              code: 'INTERNAL_ERROR',
              message:
                error instanceof Error ? error.message : 'Unknown error',
            },
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        type: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
