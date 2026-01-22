'use client';

import { useState } from 'react';
import { Thread, ThreadId } from '@/types/thread';
import ConfirmDialog from '../ui/ConfirmDialog';

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onSelect: (threadId: ThreadId) => void;
  onDelete: (threadId: ThreadId) => void;
}

export default function ThreadItem({
  thread,
  isActive,
  onSelect,
  onDelete,
}: ThreadItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(thread.id);
    setShowDeleteConfirm(false);
  };

  const lastActivityTime = new Date(thread.updatedAt).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <div
        onClick={() => onSelect(thread.id)}
        className={`group relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        role="button"
        tabIndex={0}
        aria-label={`Thread: ${thread.title}`}
        aria-current={isActive ? 'true' : 'false'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(thread.id);
          }
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {thread.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {lastActivityTime}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-opacity"
          aria-label="Delete thread"
        >
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Thread"
        message={`Are you sure you want to delete "${thread.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
