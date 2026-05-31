'use client';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="mb-4 border-b border-slate-700/70 pb-4 last:border-b-0">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-100">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
