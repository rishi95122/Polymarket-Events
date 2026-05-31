import type { Event } from '@/types/events';

export function generateEventSchema(event: Event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title || 'Prediction Market Event',
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    image: event.image,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.id}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/PreOrder',
    },
    organizer: {
      '@type': 'Organization',
      name: 'Polymarket',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Polymarket Events Filter',
    description: 'Filter and discover prediction markets on Polymarket',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/polymarketbot',
      'https://polymarket.com',
    ],
  };
}
