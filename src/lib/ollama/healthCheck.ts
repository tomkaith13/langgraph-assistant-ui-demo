import { getOllamaConfig } from './client';

export interface HealthCheckResult {
  ok: boolean;
  error?: string;
  instructions?: string;
}

export async function checkOllamaHealth(): Promise<HealthCheckResult> {
  const { baseUrl } = getOllamaConfig();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { ok: true };
    }

    return {
      ok: false,
      error: `Ollama returned status ${response.status}`,
      instructions: 'Check Ollama is running: ollama serve',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return {
      ok: false,
      error: errorMessage.includes('abort')
        ? 'Connection timeout'
        : 'Connection refused',
      instructions:
        'Ollama is not running. Start it with: ollama serve',
    };
  }
}
