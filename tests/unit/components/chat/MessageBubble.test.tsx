import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageBubble from '@/components/chat/MessageBubble';
import { Message } from '@/types/thread';

describe('MessageBubble', () => {
  const userMessage: Message = {
    id: 'msg-1',
    threadId: 'thread-1',
    role: 'user',
    content: 'Hello, assistant!',
    createdAt: Date.now(),
  };

  const assistantMessage: Message = {
    id: 'msg-2',
    threadId: 'thread-1',
    role: 'assistant',
    content: 'Hi there! How can I help?',
    createdAt: Date.now(),
  };

  it('renders user message with correct styling', () => {
    render(
      <MessageBubble
        role={userMessage.role}
        content={userMessage.content}
        timestamp={userMessage.createdAt}
      />
    );

    const bubble = screen.getByText('Hello, assistant!');
    expect(bubble).toBeInTheDocument();

    // Check for user-specific styling classes
    const container = bubble.closest('[class*="bg-"]');
    expect(container).toHaveClass('bg-blue-600');
  });

  it('renders assistant message with correct styling', () => {
    render(
      <MessageBubble
        role={assistantMessage.role}
        content={assistantMessage.content}
        timestamp={assistantMessage.createdAt}
      />
    );

    const bubble = screen.getByText('Hi there! How can I help?');
    expect(bubble).toBeInTheDocument();

    // Check for assistant-specific styling classes
    const container = bubble.closest('[class*="bg-"]');
    expect(container).toHaveClass('bg-gray-200');
  });

  it('displays message content', () => {
    render(
      <MessageBubble
        role={userMessage.role}
        content={userMessage.content}
        timestamp={userMessage.createdAt}
      />
    );
    expect(screen.getByText('Hello, assistant!')).toBeInTheDocument();
  });

  it('applies correct alignment for user messages', () => {
    render(
      <MessageBubble
        role={userMessage.role}
        content={userMessage.content}
        timestamp={userMessage.createdAt}
      />
    );

    const messageContainer = screen.getByText('Hello, assistant!').closest('[class*="justify-"]');
    expect(messageContainer).toHaveClass('justify-end');
  });

  it('applies correct alignment for assistant messages', () => {
    render(
      <MessageBubble
        role={assistantMessage.role}
        content={assistantMessage.content}
        timestamp={assistantMessage.createdAt}
      />
    );

    const messageContainer = screen.getByText('Hi there! How can I help?').closest('[class*="justify-"]');
    expect(messageContainer).toHaveClass('justify-start');
  });

  it('renders long messages without truncation', () => {
    const longMessage: Message = {
      ...userMessage,
      content: 'This is a very long message that should not be truncated. '.repeat(10),
    };

    render(
      <MessageBubble
        role={longMessage.role}
        content={longMessage.content}
        timestamp={longMessage.createdAt}
      />
    );
    expect(screen.getByText(/This is a very long message that should not be truncated/)).toBeInTheDocument();
  });

  it('renders messages with special characters', () => {
    const specialMessage: Message = {
      ...userMessage,
      content: 'Special chars: <>&"\'',
    };

    render(
      <MessageBubble
        role={specialMessage.role}
        content={specialMessage.content}
        timestamp={specialMessage.createdAt}
      />
    );
    expect(screen.getByText(/Special chars/)).toBeInTheDocument();
  });
});
