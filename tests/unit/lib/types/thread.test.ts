import { describe, it, expect } from 'vitest';
import { isThreadId, isMessageRole, isThread, isMessage } from '@/types/thread';

describe('Type Guards', () => {
  describe('isThreadId', () => {
    it('should return true for valid thread IDs', () => {
      expect(isThreadId('thread-123')).toBe(true);
      expect(isThreadId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isThreadId(123)).toBe(false);
      expect(isThreadId(null)).toBe(false);
      expect(isThreadId(undefined)).toBe(false);
    });

    it('should return false for empty strings', () => {
      expect(isThreadId('')).toBe(false);
    });
  });

  describe('isMessageRole', () => {
    it('should return true for valid message roles', () => {
      expect(isMessageRole('user')).toBe(true);
      expect(isMessageRole('assistant')).toBe(true);
    });

    it('should return false for invalid roles', () => {
      expect(isMessageRole('admin')).toBe(false);
      expect(isMessageRole('system')).toBe(false);
      expect(isMessageRole('')).toBe(false);
      expect(isMessageRole(null)).toBe(false);
    });
  });

  describe('isThread', () => {
    it('should return true for valid thread objects', () => {
      const thread = {
        id: 'thread-123',
        title: 'Test Thread',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      expect(isThread(thread)).toBe(true);
    });

    it('should return false when missing required properties', () => {
      expect(isThread({ id: 'thread-123' })).toBe(false);
      expect(isThread({ title: 'Test Thread' })).toBe(false);
      expect(isThread({})).toBe(false);
    });

    it('should return false for non-objects', () => {
      expect(isThread(null)).toBe(false);
      expect(isThread('thread-123')).toBe(false);
      expect(isThread(123)).toBe(false);
    });
  });

  describe('isMessage', () => {
    it('should return true for valid message objects', () => {
      const message = {
        id: 'msg-123',
        threadId: 'thread-123',
        role: 'user' as const,
        content: 'Hello',
        createdAt: Date.now(),
      };
      expect(isMessage(message)).toBe(true);
    });

    it('should return true for assistant messages', () => {
      const message = {
        id: 'msg-124',
        threadId: 'thread-123',
        role: 'assistant' as const,
        content: 'Hi there!',
        createdAt: Date.now(),
      };
      expect(isMessage(message)).toBe(true);
    });

    it('should return false when missing required properties', () => {
      expect(isMessage({ id: 'msg-123', role: 'user' })).toBe(false);
      expect(isMessage({ threadId: 'thread-123', role: 'user', content: 'Hello' })).toBe(false);
      expect(isMessage({})).toBe(false);
    });

    it('should return false with invalid role', () => {
      expect(
        isMessage({
          id: 'msg-123',
          threadId: 'thread-123',
          role: 'admin',
          content: 'Hello',
          createdAt: Date.now(),
        })
      ).toBe(false);
    });
  });
});
