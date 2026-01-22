/** Branded type for thread identifiers */
export type ThreadId = string & { readonly __brand: 'ThreadId' };

/** Branded type for message identifiers */
export type MessageId = string & { readonly __brand: 'MessageId' };

/** Message sender role */
export type MessageRole = 'user' | 'assistant';

/** Thread interface */
export interface Thread {
  /** Unique identifier (UUID v4) */
  id: ThreadId;

  /** Display title, auto-generated from first message (max 30 chars) */
  title: string;

  /** Unix timestamp (ms) when thread was created */
  createdAt: number;

  /** Unix timestamp (ms) of last activity (message sent/received) */
  updatedAt: number;
}

/** Message interface */
export interface Message {
  /** Unique identifier (UUID v4) */
  id: MessageId;

  /** Parent thread identifier */
  threadId: ThreadId;

  /** Sender role */
  role: MessageRole;

  /** Message text content (supports markdown) */
  content: string;

  /** Unix timestamp (ms) when message was created */
  createdAt: number;
}

/** Storage state for localStorage */
export interface StorageState {
  /** All threads, sorted by updatedAt descending */
  threads: Thread[];

  /** Messages indexed by threadId for efficient lookup */
  messagesByThread: Record<string, Message[]>;

  /** Currently active thread ID (null if none selected) */
  activeThreadId: ThreadId | null;
}

// Type guards
export function isThreadId(value: unknown): value is ThreadId {
  return typeof value === 'string' && value.length > 0;
}

export function isMessageRole(value: unknown): value is MessageRole {
  return value === 'user' || value === 'assistant';
}

export function isThread(value: unknown): value is Thread {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    isThreadId(obj.id) &&
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    obj.title.length <= 30 &&
    typeof obj.createdAt === 'number' &&
    obj.createdAt > 0 &&
    typeof obj.updatedAt === 'number' &&
    obj.updatedAt >= obj.createdAt
  );
}

export function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    obj.id.length > 0 &&
    isThreadId(obj.threadId) &&
    isMessageRole(obj.role) &&
    typeof obj.content === 'string' &&
    typeof obj.createdAt === 'number' &&
    obj.createdAt > 0
  );
}

// Helper to create branded types
export function createThreadId(id: string): ThreadId {
  if (!isThreadId(id)) {
    throw new Error(`Invalid ThreadId format: ${id}`);
  }
  return id as ThreadId;
}

export function createMessageId(): MessageId {
  return crypto.randomUUID() as MessageId;
}
