# Quickstart: LangGraph Threaded Chat

Get the chat application running locally in 5 minutes.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Ollama** installed and running ([Download](https://ollama.ai/))
- **pnpm** (recommended) or npm

### Install Ollama

```bash
# macOS
brew install ollama

# Or download from https://ollama.ai/download
```

### Pull a Model

```bash
# Start Ollama service
ollama serve

# In a new terminal, pull a model
ollama pull gpt-oss:20b
```

Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
# Should return JSON with model list
```

---

## Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repo-url>
cd assistant-ui-langgraph

# Install dependencies
pnpm install
```

### 2. Configure Environment

Create `.env.local` in the project root:

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss:20b

# Optional: Change temperature (0.0-1.0)
OLLAMA_TEMPERATURE=0.7
```

### 3. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## First Chat

1. **Create a Thread**: Click "New Chat" in the sidebar
2. **Send a Message**: Type a question and press Enter
3. **Watch Streaming**: See the AI response appear in real-time
4. **Switch Threads**: Create another thread, then switch back

---

## Project Structure (Key Files)

```
src/
├── app/
│   ├── page.tsx              # Main chat page
│   └── api/
│       └── chat/route.ts     # Chat streaming endpoint
├── components/
│   └── chat/
│       └── ChatInterface.tsx # Main chat UI
├── lib/
│   └── graph/
│       └── chatGraph.ts      # LangGraph definition
└── types/
    └── thread.ts             # Type definitions
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | Type check |

---

## Troubleshooting

### "Ollama not running" Error

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve
```

### "Model not found" Error

```bash
# List available models
ollama list

# Pull the model specified in .env.local
ollama pull gpt-oss:20b
```

### Slow Responses

- Try a different model: `ollama pull mistral` or `ollama pull neural-chat`
- Update `OLLAMA_MODEL` in `.env.local`
- Check CPU/GPU utilization

### Port Conflict

```bash
# Check if port 3000 is in use
lsof -i :3000

# Use a different port
pnpm dev -- -p 3001
```

---

## Next Steps

- **Customize UI**: Modify `src/components/chat/` components
- **Change Model**: Update `OLLAMA_MODEL` in `.env.local`
- **Add Tools**: See `src/lib/graph/chatGraph.ts` for tool integration
- **Deploy**: `pnpm build && pnpm start` or deploy to Vercel
