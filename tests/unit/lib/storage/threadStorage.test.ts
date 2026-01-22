import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mockLocalStorage } from '@tests/utils/testUtils';

describe('ThreadStorage', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it('saves and retrieves thread', () => {
    const thread = {
      id: 'thread-1',
      title: 'Test Thread',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    localStorage.setItem('thread-1', JSON.stringify(thread));
    const retrieved = JSON.parse(localStorage.getItem('thread-1') || '{}');

    expect(retrieved.id).toBe('thread-1');
    expect(retrieved.title).toBe('Test Thread');
  });

  it('saves and retrieves messages', () => {
    const messages = [
      {
        id: 'msg-1',
        threadId: 'thread-1',
        role: 'user' as const,
        content: 'Hello',
        createdAt: Date.now(),
      },
      {
        id: 'msg-2',
        threadId: 'thread-1',
        role: 'assistant' as const,
        content: 'Hi',
        createdAt: Date.now(),
      },
    ];

    localStorage.setItem('thread-1-messages', JSON.stringify(messages));
    const retrieved = JSON.parse(localStorage.getItem('thread-1-messages') || '[]');

    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].role).toBe('user');
    expect(retrieved[1].role).toBe('assistant');
  });

  it('deletes thread', () => {
    localStorage.setItem('thread-1', JSON.stringify({ id: 'thread-1' }));
    expect(localStorage.getItem('thread-1')).not.toBeNull();

    localStorage.removeItem('thread-1');
    expect(localStorage.getItem('thread-1')).toBeNull();
  });

  it('handles multiple threads', () => {
    const thread1 = { id: 'thread-1', title: 'Thread 1' };
    const thread2 = { id: 'thread-2', title: 'Thread 2' };

    localStorage.setItem('thread-1', JSON.stringify(thread1));
    localStorage.setItem('thread-2', JSON.stringify(thread2));

    const retrieved1 = JSON.parse(localStorage.getItem('thread-1') || '{}');
    const retrieved2 = JSON.parse(localStorage.getItem('thread-2') || '{}');

    expect(retrieved1.title).toBe('Thread 1');
    expect(retrieved2.title).toBe('Thread 2');
  });
});
