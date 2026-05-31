'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import EventCard from './EventCard';
import PaginationAdvanced from './PaginationAdvanced';
import ViewToggle from './ViewToggle';
import type { Event } from '@/types/events';
import type { Filters } from '@/types/filters';

interface EventListClientProps {
  events: Event[];
  nextCursor: string | null;
  filters: Filters;
  limit: number;
  currentQueryString: string;
}

export default function EventListClient({
  events,
  nextCursor,
  filters,
  limit,
  currentQueryString,
}: EventListClientProps) {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleNextPage = useCallback(() => {
    if (nextCursor) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
      params.set('limit', String(limit));
      params.set('cursor', nextCursor);
      router.push(`?${params.toString()}`);
    }
  }, [nextCursor, filters, limit, router]);

  const handlePreviousPage = useCallback(() => {
    const params = new URLSearchParams(currentQueryString);
    params.delete('cursor');
    router.push(`?${params.toString()}`);
  }, [currentQueryString, router]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 py-12 text-center">
        <p className="text-lg text-slate-200">No events found</p>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* View Toggle */}
      <div className="mb-6 flex shrink-0 items-center justify-between">
        <div className="text-slate-400">
          <p className="text-sm">
            Showing 1-{events.length} events
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {/* Events Grid or List */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-4 pb-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex gap-5 rounded-xl border border-slate-700 bg-[#091629] p-5 transition hover:border-blue-400/60"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title || "Event"}
                    className="h-28 w-32 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="mb-3 text-lg font-bold text-white">
                    {event.title}
                  </h3>
                  <div className="flex gap-8 text-sm text-slate-400">
                    <span>Vol: ${event.volume}</span>
                    <span>Liq: ${event.liquidity}</span>
                    <span>Markets: {event.markets?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {nextCursor && (
        <div className="shrink-0 border-t border-slate-800 bg-[#081321] px-2 pt-5">
          <PaginationAdvanced
            hasNextPage={!!nextCursor}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            currentPage={1}
            totalPages={62}
          />
        </div>
      )}
    </div>
  );
}
