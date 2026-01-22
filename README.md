# LangGraph Threaded Chat

A modern, threaded chat application powered by LangGraph and Ollama, featuring real-time streaming responses and persistent conversation management.

## Features

- 🚀 **Streaming AI Responses**: Real-time token streaming from Ollama LLM
- 💬 **Multi-threaded Conversations**: Create and manage up to 50 separate chat threads
- 📝 **Markdown Support**: Full markdown rendering with syntax highlighting
- 💾 **Persistent Storage**: All conversations saved to browser localStorage
- 🎨 **Modern UI**: Built with Next.js 14, React 18, and Tailwind CSS
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- 🔒 **Type-safe**: TypeScript strict mode throughout

## Prerequisites

- Node.js 18+ 
- Ollama installed and running locally
  ```bash
  # Install Ollama: https://ollama.ai
  # Start Ollama server
  ollama serve
  
  # Pull a model (e.g., llama3)
  ollama pull llama3
  ```

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd assistant-ui-langgraph
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local .env.local
   # Edit .env.local if needed (defaults work for local Ollama)
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   make dev
   ```

4. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

```bash
OLLAMA_BASE_URL=http://localhost:11434  # Ollama server URL
OLLAMA_MODEL=llama3                      # Model name
OLLAMA_TEMPERATURE=0.7                   # Response creativity (0-1)
```

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript compiler check
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

Or use the Makefile:
```bash
make dev           # Development server
make build         # Production build
make test          # Run tests
make lint          # Lint code
make typecheck     # Type check
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main chat page
│   └── api/
│       ├── chat/            # Chat streaming endpoint
│       └── health/          # Ollama health check
├── components/
│   ├── chat/                # Chat UI components
│   ├── threads/             # Thread management
│   ├── errors/              # Error handling
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── graph/               # LangGraph orchestration
│   ├── ollama/              # Ollama client
│   └── storage/             # localStorage operations
├── hooks/                   # React hooks
├── types/                   # TypeScript types
└── styles/                  # Global styles
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **State**: LangGraph for conversation orchestration
- **LLM**: Ollama (local)
- **Storage**: Browser localStorage
- **Type Safety**: TypeScript strict mode

### Key Design Patterns
- **Streaming**: Server-Sent Events (SSE) for real-time responses
- **State Management**: React hooks + localStorage for persistence
- **Type Safety**: Branded types for IDs, discriminated unions for roles
- **Error Handling**: Error boundaries + graceful degradation
- **Performance**: 10-message context window, code splitting

## Usage

### Creating Conversations
1. Click "New Chat" in the sidebar
2. Type your message and press Enter (or click Send)
3. Watch the AI response stream in real-time

### Managing Threads
- **Switch Threads**: Click any thread in the sidebar
- **Delete Threads**: Hover over a thread and click the delete icon
- **Auto-naming**: Threads are automatically named from the first message

### Keyboard Shortcuts
- `Enter`: Send message
- `Shift + Enter`: New line in message
- `Tab`: Navigate between elements

## Performance

- **Bundle Size**: ~350KB First Load JS
- **Time to Interactive**: <3s on 3G
- **Context Window**: Last 10 messages sent to LLM
- **Thread Limit**: 50 threads (oldest auto-deleted)

## Troubleshooting

### "Ollama Connection Error"
- Ensure Ollama is running: `ollama serve`
- Check the server is accessible at `http://localhost:11434`
- Verify you have a model pulled: `ollama list`

### Messages Not Persisting
- Check browser localStorage is enabled
- Ensure cookies/site data is not being cleared
- Try a different browser

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Update TypeScript: `npm install typescript@latest`

## Development

### Adding New Features
1. Define types in `src/types/`
2. Create components in `src/components/`
3. Add hooks in `src/hooks/` for state management
4. Update API routes in `src/app/api/` if needed

### Testing
```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests with Playwright
```

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Acknowledgments

- Built with [LangGraph](https://github.com/langchain-ai/langgraphjs)
- Powered by [Ollama](https://ollama.ai)
- UI inspired by [assistant-ui](https://github.com/assistant-ui/assistant-ui)
