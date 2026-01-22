import {
  Thread,
  Message,
  ThreadId,
  createThreadId,
} from '@/types/thread';

const STORAGE_KEY_PREFIX = 'langgraph-chat';
const THREADS_KEY = `${STORAGE_KEY_PREFIX}:threads`;
const ACTIVE_THREAD_KEY = `${STORAGE_KEY_PREFIX}:active`;
const MAX_THREADS = 50;

function getMessagesKey(threadId: ThreadId): string {
  return `${STORAGE_KEY_PREFIX}:messages:${threadId}`;
}

// Thread operations
export function saveThread(thread: Thread): void {
  const threads = getThreads();
  const existingIndex = threads.findIndex((t) => t.id === thread.id);

  if (existingIndex >= 0) {
    threads[existingIndex] = thread;
  } else {
    threads.unshift(thread);

    // Enforce 50-thread limit
    if (threads.length > MAX_THREADS) {
      const removed = threads.slice(MAX_THREADS);
      removed.forEach((t) => {
        localStorage.removeItem(getMessagesKey(t.id));
      });
      threads.splice(MAX_THREADS);
    }
  }

  // Sort by updatedAt descending
  threads.sort((a, b) => b.updatedAt - a.updatedAt);

  localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

export function getThreads(): Thread[] {
  const data = localStorage.getItem(THREADS_KEY);
  if (!data) return [];

  try {
    const threads = JSON.parse(data) as Thread[];
    return threads.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function getThread(threadId: ThreadId): Thread | null {
  const threads = getThreads();
  return threads.find((t) => t.id === threadId) || null;
}

export function deleteThread(threadId: ThreadId): void {
  const threads = getThreads();
  const filtered = threads.filter((t) => t.id !== threadId);
  localStorage.setItem(THREADS_KEY, JSON.stringify(filtered));
  localStorage.removeItem(getMessagesKey(threadId));

  // Clear active thread if it was deleted
  if (getActiveThreadId() === threadId) {
    setActiveThreadId(null);
  }
}

// Message operations
export function saveMessages(threadId: ThreadId, messages: Message[]): void {
  localStorage.setItem(getMessagesKey(threadId), JSON.stringify(messages));

  // Update thread's updatedAt timestamp
  const thread = getThread(threadId);
  if (thread) {
    saveThread({
      ...thread,
      updatedAt: Date.now(),
    });
  }
}

export function getMessages(threadId: ThreadId): Message[] {
  const data = localStorage.getItem(getMessagesKey(threadId));
  if (!data) return [];

  try {
    return JSON.parse(data) as Message[];
  } catch {
    return [];
  }
}

// Active thread operations
export function getActiveThreadId(): ThreadId | null {
  const data = localStorage.getItem(ACTIVE_THREAD_KEY);
  if (!data) return null;

  try {
    return createThreadId(data);
  } catch {
    return null;
  }
}

export function setActiveThreadId(threadId: ThreadId | null): void {
  if (threadId === null) {
    localStorage.removeItem(ACTIVE_THREAD_KEY);
  } else {
    localStorage.setItem(ACTIVE_THREAD_KEY, threadId);
  }
}

// Generate thread title from first user message
export function generateThreadTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  if (trimmed.length <= 30) return trimmed;
  return trimmed.substring(0, 27) + '...';
}

// Create a new thread
export function createThread(title?: string): Thread {
  const thread: Thread = {
    id: crypto.randomUUID() as ThreadId,
    title: title || 'New Chat',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  saveThread(thread);
  return thread;
}
