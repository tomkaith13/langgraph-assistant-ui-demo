# Research: LangGraph Threaded Chat

**Feature**: 001-langgraph-threaded-chat  
**Date**: 2026-01-21

## Technology Decisions

### 1. LangGraph TypeScript Integration

**Decision**: Use `@langchain/langgraph` with `StateGraph` for chat orchestration

**Rationale**: 
- LangGraph provides durable execution, streaming, and state management out of the box
- TypeScript-first with full type support via `StateSchema`
- Built-in `MessagesValue` type for chat message arrays
- Supports future extensibility to tool-calling via `bindTools()`

**Alternatives Considered**:
- Raw LangChain without LangGraph: Less structured state management
- Custom state machine: More code, less battle-tested

**Implementation Pattern**:
```typescript
import { StateSchema, MessagesValue, StateGraph, START, END } from "@langchain/langgraph";

const ChatState = new StateSchema({
  messages: MessagesValue,
});

const chatNode = async (state: typeof ChatState.State) => {
  const response = await llm.invoke(state.messages.slice(-10)); // Last 10 messages
  return { messages: [response] };
};

const graph = new StateGraph(ChatState)
  .addNode("chat", chatNode)
  .addEdge(START, "chat")
  .addEdge("chat", END)
  .compile();
```

---

### 2. Ollama Integration

**Decision**: Use `@langchain/ollama` with `ChatOllama` class

**Rationale**:
- Official LangChain integration with streaming support
- Simple instantiation with model configuration
- Built-in retry and error handling
- Supports tool-calling for future extensibility

**Implementation Pattern**:
```typescript
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: process.env.OLLAMA_MODEL || "llama3",
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  temperature: 0.7,
  maxRetries: 2,
});

// Streaming invocation
const stream = await llm.stream(messages);
for await (const chunk of stream) {
  yield chunk.content;
}
```

**Health Check Pattern**:
```typescript
async function checkOllamaHealth(): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return { ok: response.ok };
  } catch (error) {
    return { ok: false, error: "Ollama is not running. Start it with: ollama serve" };
  }
}
```

---

### 3. assistant-ui Integration

**Decision**: Use `@assistant-ui/react` with `useLocalRuntime` (not LangGraph Cloud runtime)

**Rationale**:
- `useLangGraphRuntime` is designed for LangGraph Cloud/LangSmith hosted deployments
- For local Ollama, `useLocalRuntime` with custom adapter is more appropriate
- Provides full control over state and streaming
- Built-in thread management, message editing, and branch switching

**Alternatives Considered**:
- `useLangGraphRuntime`: Requires LangGraph Cloud server, overkill for local Ollama
- `useExternalStoreRuntime`: More complex, needed only for Redux/Zustand integration

**Implementation Pattern**:
```typescript
import { useLocalRuntime, AssistantRuntimeProvider } from "@assistant-ui/react";
import { Thread } from "@assistant-ui/react";

const runtime = useLocalRuntime({
  async *run({ messages, abortSignal }) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, threadId }),
      signal: abortSignal,
    });
    
    const reader = response.body?.getReader();
    // Stream chunks to UI
    for await (const chunk of streamReader(reader)) {
      yield { content: chunk };
    }
  },
});

return (
  <AssistantRuntimeProvider runtime={runtime}>
    <Thread />
  </AssistantRuntimeProvider>
);
```

---

### 4. Streaming Architecture

**Decision**: Server-Sent Events (SSE) via Next.js API route with ReadableStream

**Rationale**:
- Native browser support, no WebSocket complexity
- Works with assistant-ui's streaming expectations
- Efficient for unidirectional server-to-client data
- Proper backpressure handling

**Implementation Pattern**:
```typescript
// API Route: /api/chat/route.ts
export async function POST(req: Request) {
  const { messages, threadId } = await req.json();
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      for await (const chunk of graph.stream({ messages })) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }
      
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

---

### 5. Thread Persistence

**Decision**: Browser localStorage with typed storage service

**Rationale**:
- No backend database needed for MVP
- Simple, synchronous access
- ~5-10MB limit sufficient for 50 threads
- Full client-side control

**Implementation Pattern**:
```typescript
interface Thread {
  id: ThreadId;
  title: string;
  createdAt: number;
  updatedAt: number;
}

interface Message {
  id: MessageId;
  threadId: ThreadId;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const STORAGE_KEY = "langgraph-chat";
const MAX_THREADS = 50;

function saveThreads(threads: Thread[]): void {
  // Auto-delete oldest if over limit
  const sorted = threads.sort((a, b) => b.updatedAt - a.updatedAt);
  const trimmed = sorted.slice(0, MAX_THREADS);
  localStorage.setItem(`${STORAGE_KEY}:threads`, JSON.stringify(trimmed));
}
```

---

### 6. Markdown Rendering

**Decision**: `react-markdown` with `remark-gfm` and `react-syntax-highlighter`

**Rationale**:
- Industry standard for React markdown rendering
- GFM support for tables, strikethrough, task lists
- Syntax highlighting for code blocks
- Tree-shakeable, good bundle size

**Implementation Pattern**:
```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={oneDark} language={match[1]}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>{children}</code>
      );
    },
  }}
>
  {content}
</ReactMarkdown>
```

---

### 7. Project Framework

**Decision**: Next.js 14+ with App Router

**Rationale**:
- assistant-ui templates use Next.js by default
- App Router supports streaming via `ReadableStream`
- Server components for initial render performance
- API routes for chat endpoint
- Built-in TypeScript support

**Alternatives Considered**:
- Vite + Express: More setup, no SSR benefits
- Remix: Good but less assistant-ui template support

---

## Dependency Summary

| Package | Version | Purpose |
|---------|---------|---------|
| `@langchain/langgraph` | ^0.2.x | Graph orchestration |
| `@langchain/ollama` | ^0.1.x | Ollama LLM integration |
| `@langchain/core` | ^0.3.x | Base LangChain types |
| `@assistant-ui/react` | ^0.7.x | Chat UI components |
| `next` | ^14.x | React framework |
| `react` | ^18.x | UI library |
| `react-markdown` | ^9.x | Markdown rendering |
| `remark-gfm` | ^4.x | GFM markdown support |
| `react-syntax-highlighter` | ^15.x | Code syntax highlighting |
| `tailwindcss` | ^3.x | Styling |
| `vitest` | ^2.x | Unit/integration testing |
| `@testing-library/react` | ^16.x | Component testing |
| `playwright` | ^1.x | E2E testing |

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| Which runtime to use? | `useLocalRuntime` for custom Ollama backend |
| How to stream? | SSE via ReadableStream in API route |
| State persistence? | localStorage with 50-thread limit |
| Markdown rendering? | react-markdown + react-syntax-highlighter |
| Context window? | Last 10 messages sent to Ollama |

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Ollama not running | Health check endpoint + specific error UI |
| Large message history | 10-message context window limit |
| localStorage overflow | 50-thread auto-deletion policy |
| Bundle size | Code-split markdown renderer, lazy load syntax themes |
