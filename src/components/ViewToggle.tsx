'use client';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-slate-700 bg-slate-950/20 p-1">
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
          view === 'grid'
            ? 'bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]'
            : 'text-slate-400 hover:text-slate-100'
        }`}
        title="Grid view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
        </svg>
        Grid
      </button>
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
          view === 'list'
            ? 'bg-blue-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]'
            : 'text-slate-400 hover:text-slate-100'
        }`}
        title="List view"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
        </svg>
        List
      </button>
    </div>
  );
}
