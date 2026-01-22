'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, ThreadId } from '@/types/thread';
import {
  getMessages,
  saveMessages,
  generateThreadTitle,
  getThread,
  saveThread,
} from '@/lib/storage/threadStorage';

export function useMessages(threadId: ThreadId | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages when thread changes
  useEffect(() => {
    if (threadId) {
      const loadedMessages = getMessages(threadId);
      setMessages(loadedMessages);
    } else {
      setMessages([]);
    }
  }, [threadId]);

  const addMessage = useCallback(
    (message: Message) => {
      if (!threadId) return;

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      saveMessages(threadId, updatedMessages);

      // Update thread title from first user message
      if (
        message.role === 'user' &&
        updatedMessages.filter((m) => m.role === 'user').length === 1
      ) {
        const thread = getThread(threadId);
        if (thread && thread.title === 'New Chat') {
          const newTitle = generateThreadTitle(message.content);
          saveThread({
            ...thread,
            title: newTitle,
          });
        }
      }
    },
    [threadId, messages]
  );

  const updateLastMessage = useCallback(
    (content: string) => {
      if (!threadId || messages.length === 0) return;

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return;

      const updatedMessages = [
        ...messages.slice(0, -1),
        {
          ...lastMessage,
          content,
        },
      ];

      setMessages(updatedMessages);
      saveMessages(threadId, updatedMessages);
    },
    [threadId, messages]
  );

  const clearMessages = useCallback(() => {
    if (!threadId) return;
    setMessages([]);
    saveMessages(threadId, []);
  }, [threadId]);

  return {
    messages,
    addMessage,
    updateLastMessage,
    clearMessages,
    setMessages,
  };
}
