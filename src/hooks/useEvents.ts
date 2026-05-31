'use client';

import { useState, useEffect } from 'react';
import { fetchEvents } from '@/services/polymarketApi';
import type { Event } from '@/types/events';
import type { Filters } from '@/types/filters';

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
  totalCount: number | null;
}

export function useEvents(
  filters: Filters,
  afterCursor: string | null,
  limit: number
): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchEvents(filters, afterCursor, limit);

        if (isMounted) {
          setEvents(response.events);
          setNextCursor(response.next_cursor || null);
          // API doesn't return totalCount, so we'll estimate
          if (!afterCursor && response.events.length < limit) {
            setTotalCount(response.events.length);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load events'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [filters, afterCursor, limit]);

  return { events, loading, error, nextCursor, totalCount };
}