import type { Event } from '@/types/events';
import { shouldHideEvent, type TagFilterGroup } from '@/lib/tagFilters';

// Filter events by title search
export function filterEventsByTitle(
  events: Event[],
  titleSearch: string
): Event[] {
  if (!titleSearch) return events;

  const search = titleSearch.toLowerCase();
  return events.filter(
    (event) =>
      event.title?.toLowerCase().includes(search) ||
      event.description?.toLowerCase().includes(search)
  );
}

// Filter events by hidden tag groups (client-side)
export function filterEventsByHiddenTags(
  events: Event[],
  hideTagSlugs: TagFilterGroup[]
): Event[] {
  if (hideTagSlugs.length === 0) return events;

  return events.filter((event) => !shouldHideEvent(event.tags || [], hideTagSlugs));
}

// Apply all client-side filters
export function applyClientSideFilters(
  events: Event[],
  titleSearch: string,
  hideTagSlugs: TagFilterGroup[]
): Event[] {
  let filtered = events;

  if (titleSearch) {
    filtered = filterEventsByTitle(filtered, titleSearch);
  }

  if (hideTagSlugs.length > 0) {
    filtered = filterEventsByHiddenTags(filtered, hideTagSlugs);
  }

  return filtered;
}
