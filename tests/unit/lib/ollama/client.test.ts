import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOllamaConfig, createOllamaClient } from '@/lib/ollama/client';

describe('OllamaClient', () => {
  beforeEach(() => {
    // Store original env vars
    process.env.OLLAMA_BASE_URL = 'http://localhost:11434';
    process.env.OLLAMA_MODEL = 'llama2';
    process.env.OLLAMA_TEMPERATURE = '0.7';
  });

  it('should initialize with environment variables', () => {
    const config = getOllamaConfig();
    expect(config.baseUrl).toBe('http://localhost:11434');
    expect(config.model).toBe('llama2');
    expect(config.temperature).toBe(0.7);
  });

  it('should use default values when env vars are not set', () => {
    delete process.env.OLLAMA_BASE_URL;
    delete process.env.OLLAMA_MODEL;
    delete process.env.OLLAMA_TEMPERATURE;

    const config = getOllamaConfig();
    expect(config.baseUrl).toBe('http://localhost:11434');
    expect(config.model).toBe('gpt-oss:20b');
    expect(config.temperature).toBe(0.7);
  });

  it('should handle string temperature correctly', () => {
    process.env.OLLAMA_TEMPERATURE = '0.5';
    const config = getOllamaConfig();
    expect(config.temperature).toBe(0.5);
  });

  it('should parse temperature as float', () => {
    process.env.OLLAMA_TEMPERATURE = '1.5';
    const config = getOllamaConfig();
    expect(typeof config.temperature).toBe('number');
    expect(config.temperature).toBe(1.5);
  });
});
