# API Contracts: Chat Endpoint

**Endpoint**: `POST /api/chat`  
**Purpose**: Send a message and receive a streaming AI response

## Request

```typescript
interface ChatRequest {
  /** Thread identifier */
  threadId: string;
  
  /** Messages to send (typically just the new user message) */
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}
```

### Example Request

```json
{
  "threadId": "550e8400-e29b-41d4-a716-446655440000",
  "messages": [
    { "role": "user", "content": "What is the capital of France?" }
  ]
}
```

### Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |

---

## Response

**Content-Type**: `text/event-stream`  
**Status Codes**:
- `200 OK` - Streaming response
- `400 Bad Request` - Invalid request body
- `503 Service Unavailable` - Ollama not running

### Stream Events

Server-Sent Events format with JSON payloads:

```typescript
// Content chunk (streamed token)
interface ContentChunkEvent {
  type: "content";
  content: string;
}

// Completion (final message)
interface CompletionEvent {
  type: "done";
  message: {
    id: string;
    role: "assistant";
    content: string;
    createdAt: number;
  };
}

// Error
interface ErrorEvent {
  type: "error";
  error: {
    code: "OLLAMA_UNAVAILABLE" | "INVALID_REQUEST" | "INTERNAL_ERROR";
    message: string;
  };
}
```

### Example Stream

```
data: {"type":"content","content":"The"}

data: {"type":"content","content":" capital"}

data: {"type":"content","content":" of"}

data: {"type":"content","content":" France"}

data: {"type":"content","content":" is"}

data: {"type":"content","content":" Paris"}

data: {"type":"content","content":"."}

data: {"type":"done","message":{"id":"msg_123","role":"assistant","content":"The capital of France is Paris.","createdAt":1705859200000}}

```

---

## Error Responses

### 400 Bad Request

```json
{
  "type": "error",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: threadId"
  }
}
```

### 503 Service Unavailable (Ollama)

```json
{
  "type": "error",
  "error": {
    "code": "OLLAMA_UNAVAILABLE",
    "message": "Ollama is not running. Start it with: ollama serve"
  }
}
```

---

## Implementation Notes

1. **Context Window**: Only last 10 messages from thread history are sent to Ollama
2. **Streaming**: Response is streamed token-by-token via SSE
3. **Abort**: Client can abort request; server should handle `AbortSignal`
4. **Timeout**: 60 second timeout for complete response
