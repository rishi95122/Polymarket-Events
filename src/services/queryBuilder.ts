import type { Filters } from '@/types/filters';

export function buildQueryParams(
  filters: Filters,
  afterCursor: string | null,
  limit: number
): Record<string, any> {
  const params: Record<string, any> = {
    limit,
  };

  // Handle closed filter - allow searching closed events if explicitly requested
  if (filters.closed !== null) {
    params.closed = filters.closed;
  } else {
    params.closed = false; // Default: exclude closed markets
  }

  // Add cursor for pagination
  if (afterCursor) {
    params.after_cursor = afterCursor;
  }

  // Search
  if (filters.title_search) {
    params.title_search = filters.title_search;
  }

  // Status filters
  if (filters.live !== null) {
    params.live = filters.live;
  }
  if (filters.featured !== null) {
    params.featured = filters.featured;
  }
  if (filters.cyom !== null) {
    params.cyom = filters.cyom;
  }

  // Liquidity range
  if (filters.liquidity_min !== null) {
    params.liquidity_min = filters.liquidity_min;
  }
  if (filters.liquidity_max !== null) {
    params.liquidity_max = filters.liquidity_max;
  }

  // Volume range
  if (filters.volume_min !== null) {
    params.volume_min = filters.volume_min;
  }
  if (filters.volume_max !== null) {
    params.volume_max = filters.volume_max;
  }

  // Date range
  if (filters.start_date_min) {
    params.start_date_min = filters.start_date_min;
  }
  if (filters.start_date_max) {
    params.start_date_max = filters.start_date_max;
  }
  if (filters.end_date_min) {
    params.end_date_min = filters.end_date_min;
  }
  if (filters.end_date_max) {
    params.end_date_max = filters.end_date_max;
  }

  // Tags - include by ID
  if (filters.tag_id.length > 0) {
    params.tag_id = filters.tag_id;
  }

  // Tags - filter by slug (category)
  if (filters.tag_slug) {
    params.tag_slug = filters.tag_slug;
  }

  // Sorting
  params.order = filters.order;
  params.ascending = filters.ascending;

  return params;
}

export function objectToQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}