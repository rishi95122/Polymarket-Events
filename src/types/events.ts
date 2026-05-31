export interface Event {
  id: string;
  ticker: string | null;
  slug: string | null;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  resolutionSource: string | null;
  startDate: string | null;
  creationDate: string | null;
  endDate: string | null;
  image: string | null;
  icon: string | null;
  active: boolean | null;
  closed: boolean | null;
  archived: boolean | null;
  featured: boolean | null;
  liquidity: number | null;
  volume: number | null;
  openInterest: number | null;
  category: string | null;
  live: boolean | null;
  cyom: boolean | null;
  markets: Market[];
  tags: Tag[];
}

export interface Market {
  id: string;
  question: string | null;
  conditionId: string;
  slug: string | null;
  liquidity: string | null;
  volume: string | null;
  endDate: string | null;
  outcomes: string | null; // JSON string of outcome names
  outcomePrices: string | null; // JSON string of prices for each outcome
  active: boolean | null;
  closed: boolean | null;
  lastTradePrice: number | null;
  bestBid: number | null;
  bestAsk: number | null;
  feeSchedule?: FeeSchedule;
}

export interface Tag {
  id: string;
  label: string | null;
  slug: string | null;
}

export interface FeeSchedule {
  exponent: number | null;
  rate: number | null;
  takerOnly: boolean | null;
  rebateRate: number | null;
}

export interface Series {
  id: string;
  title: string | null;
  slug: string | null;
}