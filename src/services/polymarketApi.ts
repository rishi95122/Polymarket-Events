import type { KeysetEventsResponse, ApiError } from '@/types/api';
import { buildQueryParams, objectToQueryString } from './queryBuilder';
import type { Filters } from '@/types/filters';
import type { Event } from '@/types/events';

const API_BASE_URL = 'https://gamma-api.polymarket.com';

export async function fetchEvents(
  filters: Filters,
  afterCursor: string | null,
  limit: number
): Promise<KeysetEventsResponse> {
  try {
    const params = buildQueryParams(filters, afterCursor, limit);
    const queryString = objectToQueryString(params);

    const url = `${API_BASE_URL}/events/keyset?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch events');
    }

    const data: KeysetEventsResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error('Failed to fetch events from Polymarket API');
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const url = `${API_BASE_URL}/events/${encodeURIComponent(id)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data: Event = await response.json();
    return data;
  } catch {
    return null;
  }
}

export async function fetchEventBySlug(slug: string): Promise<Event> {
  try {
    const url = `${API_BASE_URL}/events/slug/${encodeURIComponent(slug)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Event not found');
      }
      const error: ApiError = await response.json();
      throw new Error(error.error || 'Failed to fetch event');
    }

    const data: Event = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error('Failed to fetch event from Polymarket API');
  }
}