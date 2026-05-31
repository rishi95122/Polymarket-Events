'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Refresh the current page
    router.refresh();
    // Reset loading after a short delay
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/20 px-4 py-2 font-semibold text-slate-100 transition hover:border-blue-400/60 hover:bg-slate-800 disabled:opacity-50"
    >
      <svg
        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 12a8 8 0 1 1-2.34-5.66"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 4v6h-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {isLoading ? 'Loading...' : 'Refresh'}
    </button>
  );
}
