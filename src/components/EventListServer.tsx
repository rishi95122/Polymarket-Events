import { fetchEvents } from '@/services/polymarketApi';
import EventListClient from './EventListClient';
import type { Filters } from '@/types/filters';

interface EventListServerProps {
  filters: Filters;
  afterCursor: string | null;
  limit: number;
  currentQueryString: string;
}

export default async function EventListServer({
  filters,
  afterCursor,
  limit,
  currentQueryString,
}: EventListServerProps) {
  try {
    const response = await fetchEvents(filters, afterCursor, limit);

    return (
      <EventListClient
        events={response.events}
        nextCursor={response.next_cursor || null}
        filters={filters}
        limit={limit}
        currentQueryString={currentQueryString}
      />
    );
  } catch (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Error loading events</p>
        <p className="text-sm mt-1">
          {error instanceof Error ? error.message : 'Failed to fetch events'}
        </p>
      </div>
    );
  }
}
