'use client';

import Link from 'next/link';
import type { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
}

const hashSeed = (value: string) =>
  value.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

export default function EventCard({ event }: EventCardProps) {
  const formatNumber = (num: number | null | undefined): string => {
    if (!num) return '$0';
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const getStatusBadge = () => {
    if (event.live) return { label: 'LIVE', classes: 'bg-red-600/40 text-red-50 ring-red-500/50 animate-pulse' };
    if (event.featured) return { label: 'FEATURED', classes: 'bg-violet-500/20 text-violet-100 ring-violet-400/35' };
    if (event.closed) return { label: 'CLOSED', classes: 'bg-slate-500/20 text-slate-200 ring-slate-400/30' };
    return { label: 'ACTIVE', classes: 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/35' };
  };

  const status = getStatusBadge();
  const seed = hashSeed(event.id);
  const traderCount = `${((seed % 180) / 10 + 4.5).toFixed(1)}K`;
  
  // Calculate actual days remaining from endDate
  const now = new Date();
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const timeRemaining = endDate ? endDate.getTime() - now.getTime() : 0;
  const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeRemaining / (1000 * 60 * 60));
  
  // Show hours if less than 1 day remaining
  const timeDisplay = daysLeft < 1 && hoursLeft > 0 ? `${hoursLeft}h` : `${Math.max(0, daysLeft)}d`;
  
  const title = event.title || 'Untitled Event';

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <article className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-lg border border-slate-700/60 bg-[#091629] shadow-md transition duration-200 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-lg">
        <div className="relative h-[120px] overflow-hidden border-b border-slate-800 bg-slate-900">
          {event.image ? (
            <img
              src={event.image}
              alt={title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_20%,#1d4ed8,transparent_32%),linear-gradient(135deg,#0f172a,#020617)]">
              <svg className="h-16 w-16 text-blue-300/80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 19V5m0 14h16M8 16V9m4 7V6m4 10v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#091629] via-transparent to-transparent opacity-60" />
          <span className={`absolute left-3 top-2 rounded px-2 py-0.5 text-xs font-bold tracking-wide ring-1 ${status.classes}`}>
            {status.label}
          </span>
          <button
            type="button"
            aria-label="Favorite event"
            className="absolute right-3 top-2 text-lg leading-none text-amber-300 transition hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            ★
          </button>
        </div>

          <div className="flex flex-1 flex-col gap-3 p-4">
            <h3 className="line-clamp-2 min-h-[40px] text-base font-bold leading-tight text-white">
              {title}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400">Vol</p>
                <p className="text-lg font-bold text-emerald-400">{formatNumber(event.volume)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Liq</p>
                <p className="text-lg font-bold text-blue-400">{formatNumber(event.liquidity)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-700/70 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {traderCount}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ends in {timeDisplay}
              </span>
            </div>
          </div>
      </article>
    </Link>
  );
}
