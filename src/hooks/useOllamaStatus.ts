'use client';

import { useState, useEffect } from 'react';

interface OllamaStatus {
  available: boolean;
  error?: string;
  instructions?: string;
}

export function useOllamaStatus() {
  const [status, setStatus] = useState<OllamaStatus>({ available: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (data.status === 'ok') {
          setStatus({ available: true });
        } else {
          setStatus({
            available: false,
            error: data.ollama.error,
            instructions: data.ollama.instructions,
          });
        }
      } catch (error) {
        setStatus({
          available: false,
          error: 'Failed to connect to server',
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return { status, loading };
}
