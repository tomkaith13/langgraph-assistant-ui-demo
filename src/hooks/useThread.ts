'use client';

import { useState, useEffect, useCallback } from 'react';
import { Thread, ThreadId } from '@/types/thread';
import {
  getThreads,
  getThread,
  createThread,
  deleteThread,
  saveThread,
  getActiveThreadId,
  setActiveThreadId,
} from '@/lib/storage/threadStorage';

export function useThread() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadIdState] = useState<ThreadId | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Load threads and active thread on mount
  useEffect(() => {
    const loadedThreads = getThreads();
    const loadedActiveId = getActiveThreadId();

    setThreads(loadedThreads);

    // If there's an active thread, use it
    if (loadedActiveId) {
      setActiveThreadIdState(loadedActiveId);
    } else if (loadedThreads.length > 0) {
      // Otherwise, auto-select most recent
      const mostRecent = loadedThreads[0];
      if (mostRecent) {
        setActiveThreadIdState(mostRecent.id);
        setActiveThreadId(mostRecent.id);
      }
    }

    setLoading(false);
  }, []);

  const refreshThreads = useCallback(() => {
    setThreads(getThreads());
  }, []);

  const createNewThread = useCallback(() => {
    const newThread = createThread();
    setThreads(getThreads());
    setActiveThreadIdState(newThread.id);
    setActiveThreadId(newThread.id);
    return newThread;
  }, []);

  const selectThread = useCallback((threadId: ThreadId) => {
    setActiveThreadIdState(threadId);
    setActiveThreadId(threadId);
  }, []);

  const removeThread = useCallback((threadId: ThreadId) => {
    deleteThread(threadId);
    const updatedThreads = getThreads();
    setThreads(updatedThreads);

    // If deleted thread was active, select another
    if (threadId === activeThreadId) {
      if (updatedThreads.length > 0) {
        const newActive = updatedThreads[0];
        if (newActive) {
          setActiveThreadIdState(newActive.id);
          setActiveThreadId(newActive.id);
        }
      } else {
        setActiveThreadIdState(null);
      }
    }
  }, [activeThreadId]);

  const updateThreadTitle = useCallback((threadId: ThreadId, title: string) => {
    const thread = getThread(threadId);
    if (thread) {
      saveThread({
        ...thread,
        title,
      });
      refreshThreads();
    }
  }, [refreshThreads]);

  const activeThread = activeThreadId ? getThread(activeThreadId) : null;

  return {
    threads,
    activeThreadId,
    activeThread,
    loading,
    createNewThread,
    selectThread,
    removeThread,
    updateThreadTitle,
    refreshThreads,
  };
}
