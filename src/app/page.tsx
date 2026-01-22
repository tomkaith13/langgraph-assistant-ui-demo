'use client';

import { useOllamaStatus } from '@/hooks/useOllamaStatus';
import { useThread } from '@/hooks/useThread';
import ChatInterfaceWrapper from '@/components/chat/ChatInterfaceWrapper';
import ThreadList from '@/components/threads/ThreadList';
import OllamaError from '@/components/errors/OllamaError';

export default function Home() {
  const { status, loading } = useOllamaStatus();
  const {
    threads,
    activeThreadId,
    activeThread,
    loading: threadLoading,
    createNewThread,
    selectThread,
    removeThread,
  } = useThread();

  if (loading || threadLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Checking Ollama connection...
          </p>
        </div>
      </div>
    );
  }

  if (!status.available) {
    return (
      <OllamaError
        error={status.error || 'Ollama is not available'}
        instructions={status.instructions}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <ThreadList
        threads={threads}
        activeThreadId={activeThreadId}
        onSelectThread={selectThread}
        onCreateThread={createNewThread}
        onDeleteThread={removeThread}
      />
      <div className="flex-1">
        <ChatInterfaceWrapper
          threadId={activeThreadId}
          threadTitle={activeThread?.title}
        />
      </div>
    </div>
  );
}
