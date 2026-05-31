import type { Event } from './events';

export interface KeysetEventsResponse {
  events: Event[];
  next_cursor?: string;
}

export interface ApiError {
  type: string;
  error: string;
}