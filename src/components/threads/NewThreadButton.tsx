'use client';

interface NewThreadButtonProps {
  onClick: () => void;
}

export default function NewThreadButton({ onClick }: NewThreadButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      aria-label="Create new thread"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>New Chat</span>
    </button>
  );
}
