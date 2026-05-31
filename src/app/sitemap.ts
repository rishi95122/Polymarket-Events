import { fetchEvents } from '@/services/polymarketApi';
import { SITE_URL } from '@/lib/constants';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch first batch of events
    const response = await fetchEvents(
      {
        title_search: '',
        closed: false,
        live: null,
        featured: null,
        cyom: null,
        liquidity_min: null,
        liquidity_max: null,
        volume_min: null,
        volume_max: null,
        start_date_min: null,
        start_date_max: null,
        end_date_min: null,
        end_date_max: null,
        tag_id: [],
        tag_slug: null,
        order: 'volume',
        ascending: false,
      },
      null,
      500
    );

    // Create sitemap entries for events
    const eventEntries = response.events.map((event) => ({
      url: `${SITE_URL}/events/${event.id}`,
      lastModified: event.creationDate ? new Date(event.creationDate) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Main pages
    const mainPages: MetadataRoute.Sitemap = [
      {
        url: `${SITE_URL}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1,
      },
      ...eventEntries,
    ];

    return mainPages;
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // Return at least the main page
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 1,
      },
    ];
  }
}
