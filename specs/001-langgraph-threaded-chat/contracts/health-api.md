# API Contracts: Health Check

**Endpoint**: `GET /api/health`  
**Purpose**: Check Ollama service availability

## Request

No request body required.

### Headers

None required.

---

## Response

**Content-Type**: `application/json`  
**Status Codes**:
- `200 OK` - Ollama is running
- `503 Service Unavailable` - Ollama is not running

### Success Response (200)

```typescript
interface HealthResponse {
  status: "ok";
  ollama: {
    available: true;
    model: string;
    baseUrl: string;
  };
}
```

```json
{
  "status": "ok",
  "ollama": {
    "available": true,
    "model": "gpt-oss:20b",
    "baseUrl": "http://localhost:11434"
  }
}
```

### Error Response (503)

```typescript
interface HealthErrorResponse {
  status: "error";
  ollama: {
    available: false;
    error: string;
    instructions: string;
  };
}
```

```json
{
  "status": "error",
  "ollama": {
    "available": false,
    "error": "Connection refused",
    "instructions": "Ollama is not running. Start it with: ollama serve"
  }
}
```

---

## Implementation Notes

1. **Check Method**: Calls Ollama's `/api/tags` endpoint to verify connectivity
2. **Timeout**: 5 second timeout for health check
3. **Caching**: Client should poll periodically (e.g., every 30 seconds when error shown)
