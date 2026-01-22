import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from '@/components/chat/MessageList';
import { Message } from '@/types/thread';

describe('MessageList', () => {
  const messages: Message[] = [
    {
      id: 'msg-1',
      threadId: 'thread-1',
      role: 'user',
      content: 'Hello',
      createdAt: Date.now(),
    },
    {
      id: 'msg-2',
      threadId: 'thread-1',
      role: 'assistant',
      content: 'Hi there!',
      createdAt: Date.now(),
    },
    {
      id: 'msg-3',
      threadId: 'thread-1',
      role: 'user',
      content: 'How are you?',
      createdAt: Date.now(),
    },
  ];

  it('renders all messages', () => {
    render(<MessageList messages={messages} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    expect(screen.getByText('How are you?')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} />);

    const container = screen.getByRole('log');
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Start a conversation/)).toBeInTheDocument();
  });

  it('renders messages in correct order', () => {
    render(<MessageList messages={messages} />);

    const messageTexts = screen.getAllByText(/Hello|Hi there|How are you/);
    expect(messageTexts).toHaveLength(3);
  });

  it('renders user and assistant messages differently', () => {
    render(<MessageList messages={messages} />);

    const userMessage = screen.getByText('Hello').closest('[class*="flex"]');
    const assistantMessage = screen.getByText('Hi there!').closest('[class*="flex"]');

    expect(userMessage).toBeInTheDocument();
    expect(assistantMessage).toBeInTheDocument();
  });

  it('handles messages with markdown content', () => {
    const markdownMessages: Message[] = [
      {
        id: 'msg-1',
        threadId: 'thread-1',
        role: 'assistant',
        content: '# Hello\n\nThis is **bold** text',
        createdAt: Date.now(),
      },
    ];

    render(<MessageList messages={markdownMessages} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText(/bold/)).toBeInTheDocument();
  });

  it('renders many messages without performance issues', () => {
    const manyMessages: Message[] = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      threadId: 'thread-1',
      role: (i % 2 === 0 ? 'user' : 'assistant') as const,
      content: `Message ${i}`,
      createdAt: Date.now() + i * 1000,
    }));

    render(<MessageList messages={manyMessages} />);

    expect(screen.getByText('Message 0')).toBeInTheDocument();
    expect(screen.getByText('Message 99')).toBeInTheDocument();
  });
});
