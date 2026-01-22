import { http, HttpResponse } from 'msw';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export const handlers = [
  // Ollama health check
  http.get(`${OLLAMA_BASE_URL}/api/tags`, () => {
    return HttpResponse.json({
      models: [
        {
          name: 'llama3:latest',
          modified_at: '2024-01-01T00:00:00Z',
          size: 4661224676,
        },
      ],
    });
  }),

  // Chat API endpoint
  http.post('/api/chat', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const messages = [
          { type: 'content', content: 'Hello' },
          { type: 'content', content: ' world' },
          { type: 'content', content: '!' },
          {
            type: 'done',
            message: {
              id: 'msg_123',
              role: 'assistant',
              content: 'Hello world!',
              createdAt: Date.now(),
            },
          },
        ];

        messages.forEach((msg) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(msg)}\n\n`)
          );
        });

        controller.close();
      },
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  }),

  // Health check endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      ollama: {
        available: true,
        model: 'llama3',
        baseUrl: OLLAMA_BASE_URL,
      },
    });
  }),
];
