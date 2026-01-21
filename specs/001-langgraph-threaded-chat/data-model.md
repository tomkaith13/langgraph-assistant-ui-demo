# Data Model: LangGraph Threaded Chat

**Feature**: 001-langgraph-threaded-chat  
**Date**: 2026-01-21

## Entity Definitions

### Thread

Represents a conversation container with metadata.

```typescript
/** Branded type for thread identifiers */
type ThreadId = string & { readonly __brand: "ThreadId" };

interface Thread {
  /** Unique identifier (UUID v4) */
  id: ThreadId;
  
  /** Display title, auto-generated from first message (max 30 chars) */
  title: string;
  
  /** Unix timestamp (ms) when thread was created */
  createdAt: number;
  
  /** Unix timestamp (ms) of last activity (message sent/received) */
  updatedAt: number;
}
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `title`: Non-empty string, max 30 characters, trimmed
- `createdAt`: Positive integer, <= current timestamp
- `updatedAt`: Positive integer, >= createdAt

**State Transitions**:
```
[Created] -> [Active] -> [Archived/Deleted]
              ↑    ↓
          [Message Added]
```

---

### Message

Represents a single chat message within a thread.

```typescript
/** Branded type for message identifiers */
type MessageId = string & { readonly __brand: "MessageId" };

/** Message sender role */
type MessageRole = "user" | "assistant";

interface Message {
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
```

**Validation Rules**:
- `id`: Must be valid UUID v4 format
- `threadId`: Must reference existing thread
- `role`: Must be "user" or "assistant"
- `content`: Non-empty string for user messages; may be empty during streaming for assistant
- `createdAt`: Positive integer, <= current timestamp

**Constraints**:
- Messages are immutable after creation
- Order determined by `createdAt` timestamp
- Only last 10 messages sent to LLM for context

---

### GraphState

LangGraph execution state for chat processing.

```typescript
import { MessagesValue } from "@langchain/langgraph";

interface GraphState {
  /** Accumulated conversation messages in LangChain format */
  messages: MessagesValue;
}

/** LangChain message format (subset used) */
interface LangChainMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
```

**State Transitions**:
```
[Initial] 
    ↓ User sends message
[Messages Updated] 
    ↓ Graph invoked
[Processing] 
    ↓ LLM responds (streaming)
[Response Complete]
    ↓ Save to storage
[Persisted]
```

---

### StorageState

Aggregate state stored in localStorage.

```typescript
interface StorageState {
  /** All threads, sorted by updatedAt descending */
  threads: Thread[];
  
  /** Messages indexed by threadId for efficient lookup */
  messagesByThread: Record<ThreadId, Message[]>;
  
  /** Currently active thread ID (null if none selected) */
  activeThreadId: ThreadId | null;
}
```

**Storage Keys**:
- `langgraph-chat:threads` - Thread list
- `langgraph-chat:messages:{threadId}` - Messages per thread
- `langgraph-chat:active` - Active thread ID

**Limits**:
- Maximum 50 threads
- Auto-delete oldest threads when limit exceeded

---

## Relationships

```
┌─────────────┐         ┌─────────────┐
│   Thread    │ 1 ───── │   Message   │ *
│             │         │             │
│ - id (PK)   │         │ - id (PK)   │
│ - title     │         │ - threadId  │───┐
│ - createdAt │         │ - role      │   │
│ - updatedAt │         │ - content   │   │
└─────────────┘         │ - createdAt │   │
       ▲                └─────────────┘   │
       │                                  │
       └──────────────────────────────────┘
                    FK: threadId
```

- **Thread → Messages**: One-to-many (a thread contains many messages)
- **Message → Thread**: Many-to-one (each message belongs to exactly one thread)

---

## Type Guards

```typescript
function isThreadId(value: unknown): value is ThreadId {
  return typeof value === "string" && 
         /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isMessageRole(value: unknown): value is MessageRole {
  return value === "user" || value === "assistant";
}

function isThread(value: unknown): value is Thread {
  return (
    typeof value === "object" &&
    value !== null &&
    isThreadId((value as Thread).id) &&
    typeof (value as Thread).title === "string" &&
    typeof (value as Thread).createdAt === "number" &&
    typeof (value as Thread).updatedAt === "number"
  );
}

function isMessage(value: unknown): value is Message {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Message).id === "string" &&
    isThreadId((value as Message).threadId) &&
    isMessageRole((value as Message).role) &&
    typeof (value as Message).content === "string" &&
    typeof (value as Message).createdAt === "number"
  );
}
```

---

## Factory Functions

```typescript
function createThreadId(): ThreadId {
  return crypto.randomUUID() as ThreadId;
}

function createMessageId(): MessageId {
  return crypto.randomUUID() as MessageId;
}

function createThread(firstMessage: string): Thread {
  const now = Date.now();
  return {
    id: createThreadId(),
    title: firstMessage.trim().slice(0, 30) || "New Chat",
    createdAt: now,
    updatedAt: now,
  };
}

function createMessage(
  threadId: ThreadId,
  role: MessageRole,
  content: string
): Message {
  return {
    id: createMessageId(),
    threadId,
    role,
    content,
    createdAt: Date.now(),
  };
}
```
