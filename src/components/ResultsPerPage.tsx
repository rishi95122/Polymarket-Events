'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResultsPerPageProps {
  limit: number;
}

const LIMIT_STORAGE_KEY = 'polymarket-limit';

export default function ResultsPerPage({ limit }: ResultsPerPageProps) {
  const router = useRouter();
  const [storedLimit, setStoredLimit] = useState<number>(limit);

  // Load limit from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LIMIT_STORAGE_KEY);
    if (saved) {
      const savedLimit = Number(saved);
      setStoredLimit(savedLimit);
      // If stored limit differs from URL limit, update URL
      if (savedLimit !== limit) {
        const params = new URLSearchParams(window.location.search);
        params.set('limit', String(savedLimit));
        router.push(`?${params.toString()}`);
      }
    }
  }, []);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = e.target.value;
    setStoredLimit(Number(newLimit));
    // Save to localStorage
    localStorage.setItem(LIMIT_STORAGE_KEY, newLimit);
    // Update URL and fetch
    const params = new URLSearchParams(window.location.search);
    params.set('limit', newLimit);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-300">
        Results Per Page:
      </label>
      <select
        value={storedLimit}
        onChange={handleLimitChange}
        className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
}
