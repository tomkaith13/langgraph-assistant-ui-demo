import { ChatOllama } from '@langchain/ollama';

export interface OllamaConfig {
  model: string;
  baseUrl: string;
  temperature: number;
}

export function getOllamaConfig(): OllamaConfig {
  return {
    model: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || '0.7'),
  };
}

export function createOllamaClient(config?: Partial<OllamaConfig>): ChatOllama {
  const fullConfig = { ...getOllamaConfig(), ...config };

  return new ChatOllama({
    model: fullConfig.model,
    baseUrl: fullConfig.baseUrl,
    temperature: fullConfig.temperature,
    maxRetries: 2,
  });
}
