import type { Metadata } from 'next';

export const baseSEO: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Polymarket Events Filter | Find Prediction Markets',
    template: '%s | Polymarket Events Filter',
  },
  description:
    'Discover and filter live prediction markets on Polymarket. Search events by volume, liquidity, category, and more.',
  keywords: [
    'polymarket',
    'prediction markets',
    'filter events',
    'crypto predictions',
    'market finder',
  ],
  authors: [{ name: 'Polymarket Events' }],
  creator: 'Polymarket Events Filter',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Polymarket Events Filter | Find Prediction Markets',
    description:
      'Discover and filter live prediction markets on Polymarket',
    siteName: 'Polymarket Events Filter',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polymarket Events Filter',
    description: 'Discover and filter live prediction markets',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export function getEventMetadata(event: any): Metadata {
  return {
    title: event.title || 'Prediction Market Event',
    description:
      event.description ||
      `Volume: $${event.volume}. Liquidity: $${event.liquidity}. View this market on Polymarket.`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image ? [{ url: event.image }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${event.id}`,
    },
  };
}
