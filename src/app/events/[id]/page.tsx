import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchEvents, fetchEventBySlug, fetchEventById } from '@/services/polymarketApi';
import { generateEventSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { getEventMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import type { Event } from '@/types/events';

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getEvent(id: string): Promise<Event | null> {
  try {
    // First, try direct fetch by ID
    try {
      const directEvent = await fetchEventById(id);
      if (directEvent) return directEvent;
    } catch (err) {
      console.error(`[Event ${id}] Direct fetch failed:`, err);
    }

    // Then try slug if it looks like a slug
    if (id.includes('-') && !/^\d+$/.test(id)) {
      try {
        const event = await fetchEventBySlug(id);
        return event;
      } catch (err) {
        console.error(`[Event ${id}] Slug fetch failed:`, err);
      }
    }

    // Finally, search by ID with pagination (include closed events)
    let cursor: string | null = null;
    let pagesSearched = 0;
    const maxPages = 10;

    while (pagesSearched < maxPages) {
      try {
        const response = await fetchEvents(
          {
            title_search: '',
            closed: null,
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
          cursor,
          100
        );

        const event = response.events.find((e) => e.id === id);
        if (event) return event;

        if (!response.next_cursor) break;

        cursor = response.next_cursor;
        pagesSearched++;
      } catch (err) {
        console.error(`[Event ${id}] Search page ${pagesSearched} failed:`, err);
        break;
      }
    }

    return null;
  } catch (err) {
    console.error(`[Event ${id}] Unexpected error:`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
    };
  }

  return getEventMetadata(event);
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const schemaData = generateEventSchema(event);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Events', url: `${SITE_URL}/events` },
    { name: event.title || 'Event', url: `${SITE_URL}/events/${event.id}` },
  ]);

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return '$0';
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  const getStatusBadge = () => {
    if (event.live) return { label: 'LIVE', classes: 'bg-red-600/40 text-red-50 ring-red-500/50 animate-pulse' };
    if (event.featured) return { label: 'FEATURED', classes: 'bg-violet-500/20 text-violet-100 ring-violet-400/35' };
    if (event.closed) return { label: 'CLOSED', classes: 'bg-slate-500/20 text-slate-200 ring-slate-400/30' };
    return { label: 'ACTIVE', classes: 'bg-emerald-500/20 text-emerald-200 ring-emerald-500/35' };
  };

  const status = getStatusBadge();
  const now = new Date();
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const timeRemaining = endDate ? endDate.getTime() - now.getTime() : 0;
  const daysLeft = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(timeRemaining / (1000 * 60 * 60));
  const timeDisplay = daysLeft < 1 && hoursLeft > 0 ? `${hoursLeft}h remaining` : `${Math.max(0, daysLeft)}d remaining`;

  // Market sorting utility
  const getSortScore = (question: string): number => {
    const q = (question || '').toLowerCase();
    if (q.includes('moneyline') || q.includes('win')) return 1000;
    if (q.includes('spread')) return 900;
    if (q.includes('over') || q.includes('under') || q.includes('total')) return 800;
    if (q.match(/^\w+\s+vs\s+\w+/i)) return 700;
    return 0;
  };

  const sortMarkets = (markets: typeof event.markets) => {
    return [...markets].sort((a, b) => getSortScore(b.question || '') - getSortScore(a.question || ''));
  };

  // Get primary market for price info
  const sortedMarketsForPrice = event.markets ? sortMarkets(event.markets) : [];
  const primaryMarket = sortedMarketsForPrice.length > 0 ? sortedMarketsForPrice[0] : null;
  const formatPrice = (price: number | null | undefined): string => {
    if (!price) return 'N/A';
    return `$${price.toFixed(4)}`;
  };

  // Parse market outcomes and prices
  const parseMarketOutcomes = (market: any) => {
    try {
      const outcomes = market.outcomes ? JSON.parse(market.outcomes) : [];
      const prices = market.outcomePrices ? JSON.parse(market.outcomePrices) : [];
      return outcomes.map((outcome: string, index: number) => ({
        name: outcome,
        price: prices[index] || null,
      }));
    } catch {
      return [];
    }
  };

  // Sort markets to show moneyline and common markets first
  const sortedMarkets = event.markets ? sortMarkets(event.markets) : [];

  return (
    <div className="min-h-screen bg-[#081321]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateEventSchema(event)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema([
            { name: 'Home', url: SITE_URL },
            { name: 'Events', url: `${SITE_URL}/` },
            { name: event.title || 'Event', url: `${SITE_URL}/events/${event.id}` },
          ])),
        }}
      />

      {/* Header */}
      <header className="border-b border-slate-700/70 bg-[#091629]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link href="/" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to events
            </Link>
            {event.markets && event.markets.length > 0 && event.markets[0].slug ? (
              <a
                href={`https://polymarket.com/market/${event.markets[0].slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
                Open in Polymarket
              </a>
            ) : event.slug ? (
              <a
                href={`https://polymarket.com/event/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
                Open in Polymarket
              </a>
            ) : null}
          </div>
          <h1 className="text-4xl font-bold text-white">{event.title || 'Untitled Event'}</h1>
          {event.subtitle && <p className="text-slate-400 mt-2">{event.subtitle}</p>}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            {event.image && (
              <div className="mb-8 rounded-lg overflow-hidden border border-slate-700/70 h-96">
                <img
                  src={event.image}
                  alt={event.title || 'Event'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Status & Time */}
            <div className="flex gap-3 flex-wrap mb-8">
              <span className={`rounded-lg px-3 py-2 text-xs font-bold tracking-wide ring-1 ${status.classes}`}>
                {status.label}
              </span>
              {endDate && (
                <span className="rounded-lg px-3 py-2 text-xs font-bold tracking-wide bg-blue-500/20 text-blue-100 ring-1 ring-blue-500/35">
                  ⏱ {timeDisplay}
                </span>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </section>
            )}

            {/* Markets */}
            {event.markets && event.markets.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6">Markets ({event.markets.length})</h2>
                <div className="space-y-4">
                  {sortedMarkets.map((market) => {
                    const outcomes = parseMarketOutcomes(market);
                    return (
                      <div
                        key={market.id}
                        className="border border-slate-700/70 bg-[#091629] rounded-lg p-5 hover:border-blue-400/50 transition"
                      >
                        <h3 className="font-semibold text-white mb-4">
                          {market.question || 'Untitled Market'}
                        </h3>
                        
                        {/* Outcomes with prices */}
                        {outcomes.length > 0 && (
                          <div className="mb-4 space-y-2">
                            {outcomes.map((outcome: { name: string; price: string | null }, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-slate-800/40 rounded px-3 py-2">
                                <span className="text-slate-300 font-medium">{outcome.name}</span>
                                {outcome.price !== null && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-yellow-400">
                                      ${parseFloat(outcome.price).toFixed(2)}
                                    </span>
                                    <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                                      {(parseFloat(outcome.price) * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-slate-700/70 pt-4">
                          <div>
                            <dt className="text-slate-400 mb-1">Volume</dt>
                            <dd className="text-blue-400 font-semibold">{formatNumber(Number(market.volume))}</dd>
                          </div>
                          <div>
                            <dt className="text-slate-400 mb-1">Liquidity</dt>
                            <dd className="text-emerald-400 font-semibold">{formatNumber(Number(market.liquidity))}</dd>
                          </div>
                          {market.endDate && (
                            <div>
                              <dt className="text-slate-400 mb-1">Ends</dt>
                              <dd className="text-slate-300 font-semibold text-xs">{formatDate(market.endDate)}</dd>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
                <div className="flex gap-2 flex-wrap">
                  {event.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-blue-500/15 text-blue-300 px-3 py-1.5 rounded text-sm font-medium border border-blue-500/30"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Event Card Stats */}
            <div className="bg-[#091629] border border-slate-700/70 rounded-lg p-6 space-y-6 sticky top-6">
              {/* Key Stats */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Key Stats</h3>
                
                <div>
                  <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Volume</dt>
                  <dd className="text-2xl font-bold text-blue-400">{formatNumber(event.volume)}</dd>
                </div>
                
                <div>
                  <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Liquidity</dt>
                  <dd className="text-2xl font-bold text-emerald-400">{formatNumber(event.liquidity)}</dd>
                </div>

                {event.openInterest && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Open Interest</dt>
                    <dd className="text-2xl font-bold text-violet-400">{formatNumber(event.openInterest)}</dd>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700/70" />

              {/* Prices */}
              {primaryMarket && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Market Price</h3>
                  
                  {primaryMarket.lastTradePrice !== null && (
                    <div>
                      <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Last Trade</dt>
                      <dd className="text-2xl font-bold text-yellow-400">{formatPrice(primaryMarket.lastTradePrice)}</dd>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {primaryMarket.bestBid !== null && (
                      <div>
                        <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Bid</dt>
                        <dd className="font-semibold text-blue-400">{formatPrice(primaryMarket.bestBid)}</dd>
                      </div>
                    )}
                    {primaryMarket.bestAsk !== null && (
                      <div>
                        <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Ask</dt>
                        <dd className="font-semibold text-red-400">{formatPrice(primaryMarket.bestAsk)}</dd>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-700/70" />

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Timeline</h3>
                
                {event.startDate && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Start</dt>
                    <dd className="text-sm text-slate-300">{formatDate(event.startDate)}</dd>
                  </div>
                )}

                {event.endDate && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Ends</dt>
                    <dd className="text-sm text-slate-300">{formatDate(event.endDate)}</dd>
                  </div>
                )}

                {event.creationDate && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Created</dt>
                    <dd className="text-sm text-slate-300">{formatDate(event.creationDate)}</dd>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700/70" />

              {/* Info */}
              <div className="space-y-3 text-sm">
                {event.category && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Category</dt>
                    <dd className="text-slate-300">{event.category}</dd>
                  </div>
                )}

                {event.resolutionSource && (
                  <div>
                    <dt className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Resolution</dt>
                    <dd className="text-slate-300">{event.resolutionSource}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
