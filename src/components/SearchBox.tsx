'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchBox({
  onSearch,
  placeholder = 'Search events...',
  debounceMs = 500,
}: SearchBoxProps) {
  const [value, setValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setIsSearching(true);

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new timer for debounced search
      if (newValue.length === 0) {
        // Immediately search if cleared
        onSearch('');
        setIsSearching(false);
      } else if (newValue.length >= 2) {
        // Only search if 2+ characters
        debounceTimer.current = setTimeout(() => {
          onSearch(newValue);
          setIsSearching(false);
        }, debounceMs);
      } else {
        setIsSearching(false);
      }
    },
    [onSearch, debounceMs]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="mb-5">
      <div className="relative">
        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/75 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        {isSearching && (
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-blue-400" />
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500">Type at least 2 characters to search</p>
    </div>
  );
}
