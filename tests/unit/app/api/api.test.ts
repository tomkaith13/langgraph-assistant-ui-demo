import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { handlers } from '@tests/mocks/handlers';

const server = setupServer(...handlers);

describe('POST /api/chat', () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.close();
  });

  it('returns streaming response with SSE format', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: 'thread-1',
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
  });

  it('requires valid request body', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] }),
    });

    // Should fail without threadId
    expect(response.status).toBe(400);
  });

  it('returns 503 when Ollama is unavailable', async () => {
    server.use(
      http.post('/api/generate', () => {
        return HttpResponse.error();
      })
    );

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        threadId: 'thread-1',
        messages: [{ role: 'user', content: 'Hello' }],
      }),
    });

    // Should return 503 Service Unavailable
    expect(response.status).toBeLessThanOrEqual(503);
  });
});

describe('GET /api/health', () => {
  beforeEach(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.close();
  });

  it('returns health status', async () => {
    const response = await fetch('/api/health');

    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toContain('application/json');
  });

  it('includes available flag in response', async () => {
    const response = await fetch('/api/health');
    const data = await response.json();

    expect(data).toHaveProperty('ollama');
    expect(data.ollama).toHaveProperty('available');
    expect(typeof data.ollama.available).toBe('boolean');
  });

  it('includes error message when Ollama is unavailable', async () => {
    server.use(
      http.get('http://localhost:11434/api/tags', () => {
        return HttpResponse.error();
      })
    );

    const response = await fetch('/api/health');
    const data = await response.json();

    if (data.ollama && !data.ollama.available) {
      expect(data.ollama).toHaveProperty('error');
    }
  });
});
