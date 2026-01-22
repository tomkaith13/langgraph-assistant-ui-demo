import type { Metadata } from 'next';
import '../styles/globals.css';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

export const metadata: Metadata = {
  title: 'LangGraph Chat',
  description: 'Threaded chat application powered by LangGraph and Ollama',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
