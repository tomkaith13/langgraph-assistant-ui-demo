'use client';

import { useState } from 'react';
import { Message, createMessageId, ThreadId } from '@/types/thread';
import { useMessages } from '@/hooks/useMessages';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import LoadingIndicator from './LoadingIndicator';

interface ChatInterfaceProps {
  threadId: ThreadId | null;
  threadTitle?: string;
}

export default function ChatInterface({ threadId, threadTitle }: ChatInterfaceProps) {
  const { messages, addMessage, setMessages } = useMessages(threadId);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!threadId) return;

    const userMessage: Message = {
      id: createMessageId(),
      threadId,
      role: 'user',
      content,
      createdAt: Date.now(),
    };

  addMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream');
      }

      let assistantContent = '';
      const assistantMessageId = createMessageId();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'content') {
              assistantContent += data.content;
              setMessages((prev) => {
                const withoutLastAssistant = prev.filter(
                  (m) => m.id !== assistantMessageId
                );
                return [
                  ...withoutLastAssistant,
                  {
                    id: assistantMessageId,
                    threadId,
                    role: 'assistant' as const,
                    content: assistantContent,
                    createdAt: Date.now(),
                  },
                ];
              });
            } else if (data.type === 'done') {
              // Final message with complete content
              const finalMessage: Message = {
                ...data.message,
                threadId,
              };
              addMessage(finalMessage);
            } else if (data.type === 'error') {
              console.error('Stream error:', data.error);
              throw new Error(data.error.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: Message = {
        id: createMessageId(),
        threadId,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: Date.now(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!threadId) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <p>Select a thread or create a new one to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 className="text-xl font-semibold">{threadTitle || 'Chat'}</h1>
      </div>
      <MessageList messages={messages} />
      {isLoading && <LoadingIndicator />}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
