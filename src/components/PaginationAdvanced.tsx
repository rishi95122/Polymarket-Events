'use client';

interface PaginationProps {
  hasNextPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  currentPage?: number;
  totalPages?: number;
}

export default function PaginationAdvanced({
  hasNextPage,
  onNextPage,
  onPreviousPage,
  currentPage = 1,
  totalPages = 10,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    }

    return pages;
  };

  const buttonClass =
    'grid h-12 min-w-12 place-items-center rounded-lg border border-slate-800 bg-slate-950/20 px-4 text-sm font-medium text-slate-100 transition hover:border-blue-400/60 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        className={`${buttonClass} gap-2 px-5`}
      >
        Prev
      </button>

      {getPageNumbers().map((page, idx) => (
        <button
          key={`${page}-${idx}`}
          onClick={() => {
            if (typeof page === 'number') {
              const diff = page - currentPage;
              if (diff > 0) {
                for (let i = 0; i < diff; i++) onNextPage();
              } else {
                for (let i = 0; i < -diff; i++) onPreviousPage();
              }
            }
          }}
          disabled={page === '...'}
          className={
            page === currentPage
              ? 'grid h-12 min-w-12 place-items-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)]'
              : page === '...'
                ? 'grid h-12 min-w-12 place-items-center rounded-lg px-4 text-sm text-slate-500'
                : buttonClass
          }
        >
          {page}
        </button>
      ))}

      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`${buttonClass} px-5`}
      >
        Next
      </button>
    </div>
  );
}
