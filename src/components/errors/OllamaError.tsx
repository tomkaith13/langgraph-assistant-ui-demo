'use client';

export interface OllamaErrorProps {
  error: string;
  instructions?: string;
}

export default function OllamaError({ error, instructions }: OllamaErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Ollama Connection Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              {instructions && (
                <div className="mt-3 bg-red-100 rounded p-3">
                  <p className="font-mono text-xs">{instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
