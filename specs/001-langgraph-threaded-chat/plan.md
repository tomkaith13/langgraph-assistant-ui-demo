# Implementation Plan: LangGraph Threaded Chat

**Branch**: `001-langgraph-threaded-chat` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-langgraph-threaded-chat/spec.md`

## Summary

Build a threaded chat application using LangGraph (TypeScript) for conversation orchestration and assistant-ui for the React frontend. The app enables users to have multi-turn conversations with a local Ollama LLM, organized into persistent threads with full markdown rendering and streaming responses. Architecture designed for future tool-calling extensibility.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode  
**Primary Dependencies**: @langchain/langgraph (state orchestration), assistant-ui (conversational UI), React 18+, @langchain/ollama  
**Storage**: Browser localStorage (threads + messages, 50 thread limit)  
**Testing**: Vitest (unit/integration), Playwright (E2E), Testing Library (React)  
**Target Platform**: Web browser (ES2022+) with Node.js 18+ dev server  
**Project Type**: Web application (frontend + backend API route)  
**Performance Goals**: TTI <3s (3G), UI response <100ms, streaming response start <2s  
**Constraints**: Bundle <200KB gzipped, WCAG 2.1 AA, 10-message context window to Ollama  
**Scale/Scope**: Single user, 50 threads max, ~100 messages per thread typical

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with core principles from `.specify/memory/constitution.md`:

- [x] **Type-Safe Development**: All code uses TypeScript strict mode, no `any` types, exported type definitions for APIs
  - Branded types for ThreadId, MessageId
  - Discriminated unions for message roles and graph states
  - Full type exports for all public interfaces
- [x] **Test-Driven Quality**: Tests written before implementation, coverage thresholds defined (≥85%)
  - Unit tests for graph nodes, storage service, message utilities
  - Integration tests for LangGraph flow, assistant-ui components
  - E2E tests for chat flow, thread management
- [x] **UX Consistency**: Design tokens/theme configured, accessibility requirements identified (WCAG 2.1 AA)
  - assistant-ui provides built-in theme system
  - Keyboard navigation (Enter to send, Tab)
  - ARIA labels for thread list, message bubbles
- [x] **Performance & Responsiveness**: Performance budgets defined (TTI <3s, bundle <200KB gzipped, UI <100ms)
  - Streaming responses for immediate feedback
  - Code splitting for markdown renderer
  - React.memo for message list optimization

*All gates pass. Proceeding to Phase 0.*

## Project Structure

### Documentation (this feature)

```text
specs/001-langgraph-threaded-chat/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main chat page
│   └── api/
│       └── chat/
│           └── route.ts     # LangGraph streaming endpoint
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx    # Main chat container
│   │   ├── MessageList.tsx      # Virtualized message display
│   │   ├── MessageBubble.tsx    # Individual message with markdown
│   │   ├── ChatInput.tsx        # Input with send button
│   │   └── LoadingIndicator.tsx # Streaming/thinking state
│   ├── threads/
│   │   ├── ThreadList.tsx       # Sidebar thread navigation
│   │   ├── ThreadItem.tsx       # Single thread row
│   │   └── NewThreadButton.tsx  # Create thread action
│   └── errors/
│       └── OllamaError.tsx      # Ollama-specific error UI
├── lib/
│   ├── graph/
│   │   ├── chatGraph.ts         # LangGraph definition
│   │   ├── nodes/
│   │   │   └── chatNode.ts      # Chat completion node
│   │   └── state.ts             # Graph state types
│   ├── storage/
│   │   ├── threadStorage.ts     # localStorage operations
│   │   └── types.ts             # Storage types
│   └── ollama/
│       ├── client.ts            # Ollama client wrapper
│       └── healthCheck.ts       # Connection status
├── hooks/
│   ├── useThread.ts             # Thread CRUD operations
│   ├── useMessages.ts           # Message management
│   └── useOllamaStatus.ts       # Health check hook
├── types/
│   ├── thread.ts                # Thread, Message types
│   ├── graph.ts                 # Graph state types
│   └── index.ts                 # Re-exports
└── styles/
    └── globals.css              # Tailwind + custom tokens

tests/
├── unit/
│   ├── lib/
│   │   ├── graph/
│   │   └── storage/
│   └── hooks/
├── integration/
│   ├── graph.test.ts            # LangGraph flow tests
│   └── storage.test.ts          # Storage operations
└── e2e/
    ├── chat.spec.ts             # Send message flow
    └── threads.spec.ts          # Thread management
```

**Structure Decision**: Next.js App Router structure with `src/` directory. Separates concerns into `components/` (UI), `lib/` (business logic), `hooks/` (React state), `types/` (shared types). API route handles LangGraph streaming. Tests mirror source structure.

## Complexity Tracking

*No constitution violations requiring justification.*

---

## Constitution Re-Check (Post Phase 1 Design)

*GATE: Verify design decisions comply with constitution principles.*

- [x] **Type-Safe Development**: ✅ PASS
  - Branded types defined for ThreadId, MessageId (see data-model.md)
  - Type guards for runtime validation
  - Discriminated union for MessageRole
  - Full type exports planned in `types/index.ts`

- [x] **Test-Driven Quality**: ✅ PASS
  - Test structure defined mirroring source
  - Unit tests for graph nodes, storage, hooks
  - Integration tests for LangGraph flow
  - E2E tests for critical user journeys

- [x] **UX Consistency**: ✅ PASS
  - assistant-ui primitives used (Thread, AssistantRuntimeProvider)
  - Keyboard accessibility planned (Enter to send)
  - Error states defined (OllamaError component)
  - Loading/streaming states via assistant-ui

- [x] **Performance & Responsiveness**: ✅ PASS
  - Streaming architecture (SSE) for immediate feedback
  - 10-message context limit prevents large payloads
  - Code-split markdown renderer (lazy loading)
  - 50-thread limit prevents storage bloat

*All constitution gates pass. Ready for /speckit.tasks.*

---

## Phase Outputs Summary

| Phase | Artifact | Status |
|-------|----------|--------|
| Phase 0 | research.md | ✅ Complete |
| Phase 1 | data-model.md | ✅ Complete |
| Phase 1 | contracts/chat-api.md | ✅ Complete |
| Phase 1 | contracts/health-api.md | ✅ Complete |
| Phase 1 | quickstart.md | ✅ Complete |
| Phase 2 | tasks.md | ⏳ Pending `/speckit.tasks` |
