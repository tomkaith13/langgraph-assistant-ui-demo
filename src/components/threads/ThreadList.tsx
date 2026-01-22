'use client';

import { Thread, ThreadId } from '@/types/thread';
import NewThreadButton from './NewThreadButton';
import ThreadItem from './ThreadItem';

interface ThreadListProps {
  threads: Thread[];
  activeThreadId: ThreadId | null;
  onSelectThread: (threadId: ThreadId) => void;
  onCreateThread: () => void;
  onDeleteThread: (threadId: ThreadId) => void;
}

export default function ThreadList({
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  onDeleteThread,
}: ThreadListProps) {
  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Conversations
        </h2>
        <NewThreadButton onClick={onCreateThread} />
      </div>
      <div
        className="flex-1 overflow-y-auto p-2 space-y-1"
        role="list"
        aria-label="Thread list"
      >
        {threads.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 px-4">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Click &quot;New Chat&quot; to start</p>
          </div>
        ) : (
          threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThreadId}
              onSelect={onSelectThread}
              onDelete={onDeleteThread}
            />
          ))
        )}
      </div>
    </div>
  );
}
