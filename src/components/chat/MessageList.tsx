'use client';

import { useRef, useEffect } from 'react';
import { Message } from '@/types/thread';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Start a conversation by typing a message below</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.createdAt}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
