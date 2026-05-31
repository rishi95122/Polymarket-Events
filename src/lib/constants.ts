export const SITE_NAME = 'Polymarket Events Filter';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const SORT_OPTIONS = [
  { value: 'volume', label: 'Volume' },
  { value: 'liquidity', label: 'Liquidity' },
  { value: 'createdAt', label: 'Newest' },
  { value: 'featured', label: 'Featured' },
];
