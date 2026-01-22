'use client';

import { useLocalRuntime, AssistantRuntimeProvider } from '@assistant-ui/react';
import { Thread } from '@assistant-ui/react';
import { ThreadId } from '@/types/thread';

interface ChatInterfaceWrapperProps {
  threadId: ThreadId | null;
  threadTitle?: string;
}

export default function ChatInterfaceWrapper({
  threadId,
  threadTitle,
}: ChatInterfaceWrapperProps) {
  const runtime = useLocalRuntime({
    async *run({ messages, abortSignal }) {
      if (!threadId) {
        throw new Error('No thread ID provided');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          messages: messages.map((m) => ({
            role: m.role,
            content:
              typeof m.content === 'string'
                ? m.content
                : m.content
                    .map((c) => (c.type === 'text' ? c.text : ''))
                    .join(''),
          })),
        }),
        signal: abortSignal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'content') {
                  yield data.content;
                } else if (data.type === 'done') {
                  // Message complete
                  return;
                } else if (data.type === 'error') {
                  throw new Error(data.error.message);
                }
              } catch (e) {
                if (e instanceof SyntaxError) {
                  // Ignore JSON parse errors for incomplete chunks
                  continue;
                }
                throw e;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },
  });

  if (!threadId) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <p>Select a thread or create a new one to start chatting</p>
      </div>
    );
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex flex-col h-screen">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <h1 className="text-xl font-semibold">{threadTitle || 'Chat'}</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
