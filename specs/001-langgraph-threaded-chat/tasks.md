# Tasks: LangGraph Threaded Chat

**Input**: Design documents from `/specs/001-langgraph-threaded-chat/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Included per constitution TDD requirements (unit, integration, E2E; ≥85% coverage target).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 14 project with App Router and TypeScript strict mode
- [ ] T002 Install core dependencies: @langchain/langgraph, @langchain/ollama, @langchain/core, @assistant-ui/react
- [ ] T003 [P] Install UI dependencies: react-markdown, remark-gfm, react-syntax-highlighter, tailwindcss
- [ ] T004 [P] Configure TypeScript strict mode in tsconfig.json with no `any` types
- [ ] T005 [P] Setup Tailwind CSS configuration in tailwind.config.ts
- [ ] T006 [P] Create global styles in src/styles/globals.css with Tailwind imports
- [ ] T007 [P] Create .env.local template with OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TEMPERATURE
- [ ] T008 [P] Configure ESLint with TypeScript rules in .eslintrc.json
- [ ] T009 [P] Create Makefile with rules for dev, build, start, test, test:e2e, lint, typecheck in Makefile
- [ ] T077 [P] Install test dependencies: vitest, @testing-library/react, @testing-library/user-event, @playwright/test, msw
- [ ] T078 [P] Configure Vitest in vitest.config.ts with coverage thresholds (85% statements/branches)
- [ ] T079 [P] Configure Playwright in playwright.config.ts for E2E tests
- [ ] T080 [P] Create test utilities and mocks in tests/utils/testUtils.ts
- [ ] T081 [P] Create MSW handlers for Ollama API mocking in tests/mocks/handlers.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Type System (Required for All Stories)

- [ ] T010 Create branded types for ThreadId and MessageId in src/types/thread.ts
- [ ] T011 [P] Create MessageRole discriminated union type in src/types/thread.ts
- [ ] T012 [P] Create Thread interface with validation rules in src/types/thread.ts
- [ ] T013 [P] Create Message interface with validation rules in src/types/thread.ts
- [ ] T014 Create type guards (isThreadId, isMessageRole, isThread, isMessage) in src/types/thread.ts
- [ ] T015 [P] Create GraphState interface for LangGraph in src/types/graph.ts
- [ ] T016 [P] Create StorageState interface in src/types/thread.ts
- [ ] T017 Create type re-exports barrel file in src/types/index.ts
- [ ] T082 Write unit tests for type guards (isThreadId, isMessageRole, isThread, isMessage) in tests/unit/lib/types/thread.test.ts

### LangGraph Core (Required for US1)

- [ ] T018 Create Ollama client wrapper with environment config in src/lib/ollama/client.ts
- [ ] T019 [P] Create Ollama health check function in src/lib/ollama/healthCheck.ts
- [ ] T020 Create LangGraph state schema using StateSchema in src/lib/graph/state.ts
- [ ] T021 Create chat node with 10-message context limit in src/lib/graph/nodes/chatNode.ts
- [ ] T022 Create LangGraph chat graph with StateGraph in src/lib/graph/chatGraph.ts
- [ ] T083 [P] Write unit tests for Ollama client wrapper in tests/unit/lib/ollama/client.test.ts
- [ ] T084 [P] Write unit tests for chat node (10-message limit, message formatting) in tests/unit/lib/graph/chatNode.test.ts
- [ ] T085 Write integration tests for LangGraph chat flow in tests/integration/graph.test.ts

### assistant-ui Runtime (Required for US1)

- [ ] T023 Create SSE stream reader utility for parsing server events in src/lib/utils/streamReader.ts
- [ ] T024 Create useLocalRuntime hook configuration for assistant-ui in src/hooks/useLocalRuntime.ts

### Error Handling (Required for All Stories)

- [ ] T025 Create OllamaError component with setup instructions in src/components/errors/OllamaError.tsx
- [ ] T026 [P] Create error boundary wrapper component in src/components/errors/ErrorBoundary.tsx

### Root Layout

- [ ] T027 Create root layout with AssistantRuntimeProvider in src/app/layout.tsx

**Checkpoint**: Foundation ready with test infrastructure - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Send Message and Receive AI Response (Priority: P1) 🎯 MVP

**Goal**: User can type a question and receive a streaming AI response from Ollama

**Independent Test**: Open the app, type "What is the capital of France?", press Enter, verify AI response streams in and displays with markdown formatting.

### API Endpoint (Chat Streaming)

- [ ] T028 [US1] Create POST /api/chat route handler with request validation in src/app/api/chat/route.ts
- [ ] T029 [US1] Implement SSE streaming response with ReadableStream in src/app/api/chat/route.ts
- [ ] T030 [US1] Add Ollama error handling with OLLAMA_UNAVAILABLE code in src/app/api/chat/route.ts
- [ ] T031 [US1] Add request timeout (60s) and abort signal handling in src/app/api/chat/route.ts

### Chat UI Components

- [ ] T032 [P] [US1] Create LoadingIndicator component for streaming/thinking state in src/components/chat/LoadingIndicator.tsx
- [ ] T033 [P] [US1] Create markdown renderer with react-markdown and syntax highlighting in src/components/chat/MarkdownRenderer.tsx
- [ ] T034 [US1] Create MessageBubble component with role styling and timestamp in src/components/chat/MessageBubble.tsx
- [ ] T035 [US1] Create MessageList component with auto-scroll behavior in src/components/chat/MessageList.tsx
- [ ] T036 [US1] Create ChatInput component with Enter-to-send, button, and disabled state while processing in src/components/chat/ChatInput.tsx
- [ ] T037 [US1] Create ChatInterface container component integrating assistant-ui Thread in src/components/chat/ChatInterface.tsx

### Main Page

- [ ] T038 [US1] Create main chat page using ChatInterface in src/app/page.tsx

### Health Check API

- [ ] T039 [US1] Create GET /api/health endpoint for Ollama status check in src/app/api/health/route.ts

### Hooks

- [ ] T040 [US1] Create useOllamaStatus hook for polling health check in src/hooks/useOllamaStatus.ts

### US1 Tests

- [ ] T086 [P] [US1] Write unit tests for /api/chat route handler in tests/unit/app/api/chat/route.test.ts
- [ ] T087 [P] [US1] Write unit tests for /api/health route handler in tests/unit/app/api/health/route.test.ts
- [ ] T088 [P] [US1] Write component tests for ChatInput in tests/unit/components/chat/ChatInput.test.tsx
- [ ] T089 [P] [US1] Write component tests for MessageBubble in tests/unit/components/chat/MessageBubble.test.tsx
- [ ] T090 [P] [US1] Write component tests for MessageList in tests/unit/components/chat/MessageList.test.tsx
- [ ] T091 [US1] Write E2E test for send message and receive streaming response in tests/e2e/chat.spec.ts

**Checkpoint**: User Story 1 complete with tests - user can send messages and receive streaming AI responses with markdown rendering

---

## Phase 4: User Story 2 - Create and Switch Between Threads (Priority: P2)

**Goal**: User can create new conversation threads and switch between them

**Independent Test**: Create a new thread, send "Hello", create another thread, send "Goodbye", switch back to first thread and verify "Hello" is still there.

### Storage Service

- [ ] T041 [US2] Create localStorage service with STORAGE_KEY prefix in src/lib/storage/threadStorage.ts
- [ ] T042 [US2] Implement saveThread, getThreads, deleteThread functions in src/lib/storage/threadStorage.ts
- [ ] T043 [US2] Implement 50-thread limit with auto-delete oldest in src/lib/storage/threadStorage.ts
- [ ] T044 [US2] Implement saveMessages, getMessages functions per thread in src/lib/storage/threadStorage.ts
- [ ] T045 [US2] Implement getActiveThreadId, setActiveThreadId functions in src/lib/storage/threadStorage.ts

### Thread Hooks

- [ ] T046 [US2] Create useThread hook for CRUD operations in src/hooks/useThread.ts
- [ ] T047 [US2] Create useMessages hook for message management in src/hooks/useMessages.ts

### Thread UI Components

- [ ] T048 [P] [US2] Create NewThreadButton component in src/components/threads/NewThreadButton.tsx
- [ ] T049 [P] [US2] Create ThreadItem component with title and last activity in src/components/threads/ThreadItem.tsx
- [ ] T050 [US2] Create ThreadList sidebar component in src/components/threads/ThreadList.tsx
- [ ] T075 [P] [US2] Create ConfirmDialog reusable component in src/components/ui/ConfirmDialog.tsx
- [ ] T076 [US2] Add delete button with confirmation to ThreadItem in src/components/threads/ThreadItem.tsx

### Integration

- [ ] T051 [US2] Update ChatInterface to pass threadId to API and manage thread state in src/components/chat/ChatInterface.tsx
- [ ] T052 [US2] Update page.tsx to include ThreadList sidebar layout in src/app/page.tsx
- [ ] T053 [US2] Generate thread title from first user message (30 char truncate) in src/lib/storage/threadStorage.ts

### US2 Tests

- [ ] T092 [P] [US2] Write unit tests for threadStorage (CRUD, 50-limit, title generation) in tests/unit/lib/storage/threadStorage.test.ts
- [ ] T093 [P] [US2] Write unit tests for useThread hook in tests/unit/hooks/useThread.test.ts
- [ ] T094 [P] [US2] Write unit tests for useMessages hook in tests/unit/hooks/useMessages.test.ts
- [ ] T095 [P] [US2] Write component tests for ThreadList in tests/unit/components/threads/ThreadList.test.tsx
- [ ] T096 [P] [US2] Write component tests for ThreadItem (including delete) in tests/unit/components/threads/ThreadItem.test.tsx
- [ ] T097 [US2] Write integration tests for storage operations in tests/integration/storage.test.ts
- [ ] T098 [US2] Write E2E test for thread creation and switching in tests/e2e/threads.spec.ts

**Checkpoint**: User Story 2 complete with tests - user can create multiple threads, switch between them, each maintaining separate conversation history

---

## Phase 5: User Story 3 - View Conversation History Within Thread (Priority: P3)

**Goal**: User can scroll through conversation history and see all messages in correct order

**Independent Test**: Send 20+ messages in a thread, scroll up to view oldest messages, verify all messages are visible and in chronological order.

### Enhanced Message List

- [ ] T054 [US3] Implement scroll position tracking in MessageList in src/components/chat/MessageList.tsx
- [ ] T055 [US3] Add smart auto-scroll (only if at bottom) when new messages arrive in src/components/chat/MessageList.tsx
- [ ] T056 [US3] Add message timestamps display formatting in src/components/chat/MessageBubble.tsx

### Performance

- [ ] T057 [P] [US3] Add React.memo optimization to MessageBubble component in src/components/chat/MessageBubble.tsx
- [ ] T058 [P] [US3] Add lazy loading for markdown renderer (code-split) in src/components/chat/MarkdownRenderer.tsx

### US3 Tests

- [ ] T099 [US3] Write component tests for scroll behavior (auto-scroll, smart scroll) in tests/unit/components/chat/MessageList.test.tsx
- [ ] T100 [US3] Write E2E test for viewing conversation history with scroll in tests/e2e/chat.spec.ts

**Checkpoint**: User Story 3 complete with tests - user can view full conversation history with proper scrolling behavior

---

## Phase 6: User Story 4 - Persistent Thread Storage (Priority: P4)

**Goal**: Threads and messages persist across browser sessions

**Independent Test**: Create a thread with messages, close the browser completely, reopen, verify thread and all messages are restored.

### Persistence Logic

- [ ] T059 [US4] Implement thread restoration on app load in src/hooks/useThread.ts
- [ ] T060 [US4] Implement message restoration per thread in src/hooks/useMessages.ts
- [ ] T061 [US4] Auto-select most recently active thread on load in src/hooks/useThread.ts
- [ ] T062 [US4] Add localStorage error handling with fallback behavior in src/lib/storage/threadStorage.ts

### State Sync

- [ ] T063 [US4] Ensure messages are saved after each AI response completes in src/components/chat/ChatInterface.tsx
- [ ] T064 [US4] Update thread's updatedAt timestamp on new messages in src/lib/storage/threadStorage.ts

### US4 Tests

- [ ] T101 [US4] Write unit tests for persistence restoration logic in tests/unit/hooks/useThread.test.ts
- [ ] T102 [US4] Write E2E test for persistence across browser sessions in tests/e2e/persistence.spec.ts

**Checkpoint**: User Story 4 complete with tests - all data persists across browser sessions

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Edge Cases

- [ ] T065 [P] Add empty message validation (prevent sending) in src/components/chat/ChatInput.tsx
- [ ] T066 [P] Add message length limit validation (4000 chars) with character counter in src/components/chat/ChatInput.tsx
- [ ] T067 [P] Handle rapid message sending with queue in src/hooks/useMessages.ts

### Accessibility

- [ ] T068 [P] Add ARIA labels to thread list and message bubbles
- [ ] T069 [P] Add keyboard navigation (Tab) throughout the app
- [ ] T070 [P] Ensure WCAG 2.1 AA color contrast compliance
- [ ] T103 [P] Write E2E accessibility tests (keyboard nav, ARIA) in tests/e2e/accessibility.spec.ts

### Error Handling

- [ ] T071 Add network error handling with retry option in ChatInterface in src/components/chat/ChatInterface.tsx
- [ ] T072 Add partial response preservation on error in src/components/chat/ChatInterface.tsx

### Documentation

- [ ] T073 [P] Verify quickstart.md accuracy and update if needed
- [ ] T074 Run quickstart.md validation (manual test)

### Test Coverage Verification

- [ ] T104 Run full test suite and verify ≥85% coverage threshold is met
- [ ] T105 Fix any coverage gaps identified in T104

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3 → P4)
  - US2 depends on US1 (needs working chat to test thread switching)
  - US3 depends on US1 (needs messages to display history)
  - US4 depends on US2 (needs thread storage service)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 - Needs working chat to verify thread isolation
- **User Story 3 (P3)**: Can start after US1 - Needs message display to verify history scrolling
- **User Story 4 (P4)**: Can start after US2 - Extends storage service with persistence

### Within Each User Story

- API endpoints before UI components
- Core components before container components
- Hooks after their dependencies (storage service, etc.)
- Integration tasks last

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005, T006, T007, T008, T009 can all run in parallel
T077, T078, T079, T080, T081 can all run in parallel (test setup)
```

**Phase 2 (Foundational)**:
```
After T010: T011, T012, T013, T015, T016 can run in parallel
T018 and T019 can run in parallel
T025 and T026 can run in parallel
T083, T084 can run in parallel after their implementations
T082 can run after T014
```

**Phase 3 (User Story 1)**:
```
T032 and T033 can run in parallel (no dependencies on each other)
T086, T087, T088, T089, T090 can run in parallel (tests)
T091 (E2E) runs after all US1 implementation tasks
```

**Phase 4 (User Story 2)**:
```
T048, T049, and T075 can run in parallel
T076 depends on T049 and T075
T092, T093, T094, T095, T096 can run in parallel (tests)
T097, T098 run after all US2 implementation tasks
```

**Phase 5 (User Story 3)**:
```
T057 and T058 can run in parallel
T099, T100 run after US3 implementation tasks
```

---

## Parallel Example: User Story 1 Components

```bash
# Launch independent chat components in parallel:
Task T032: "Create LoadingIndicator component in src/components/chat/LoadingIndicator.tsx"
Task T033: "Create markdown renderer in src/components/chat/MarkdownRenderer.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~9 tasks)
2. Complete Phase 2: Foundational (~18 tasks) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (~13 tasks)
4. **STOP and VALIDATE**: Test sending messages and receiving streaming AI responses
5. Deploy/demo if ready - This is a functional chat app!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test: Send message, receive streaming response → **MVP!**
3. Add User Story 2 → Test: Create threads, switch between them → Multi-thread support
4. Add User Story 3 → Test: Scroll history, verify chronological order → Better UX
5. Add User Story 4 → Test: Close/reopen browser, data persists → Production-ready
6. Add Polish → Test: Edge cases, accessibility → Polished product

### File Conflict Avoidance

Tasks are designed to minimize file conflicts:
- Type definitions created before implementations
- Each component in its own file
- Hooks separated from components
- API routes isolated per endpoint

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story builds on previous but can be demoed independently
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- assistant-ui provides Thread component - leverage its primitives
- Streaming via SSE (Server-Sent Events) not WebSocket
- **TDD workflow**: Write tests before or alongside implementation; verify tests fail first, then pass
- **Coverage target**: ≥85% statements/branches per constitution
- Test tasks marked [P] can run in parallel with other [P] test tasks
- **Test scope**: Tests should validate functional requirements (FR-001 through FR-017) only—no speculative tests, edge case over-coverage, or testing implementation details. Focus on behavior, not internals.
