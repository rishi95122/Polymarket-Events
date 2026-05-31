'use client';

interface PaginationProps {
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  isLoading?: boolean;
}

export default function Pagination({
  hasNextPage,
  onNextPage,
  onPreviousPage,
  isLoading = false,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={onPreviousPage}
        disabled={isLoading}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        ← Previous
      </button>

      <button
        onClick={onNextPage}
        disabled={!hasNextPage || isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        Next →
      </button>
    </div>
  );
}