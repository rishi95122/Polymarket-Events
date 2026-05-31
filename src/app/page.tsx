import { Metadata } from 'next';
import { Suspense } from 'react';
import FilterPanel from '@/components/FilterPanel';
import EventListServer from '@/components/EventListServer';
import ResultsPerPage from '@/components/ResultsPerPage';
import RefreshButton from '@/components/RefreshButton';
import { baseSEO } from '@/lib/seo';
import { generateOrganizationSchema } from '@/lib/schema';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = baseSEO;

interface SearchParams {
  search?: string;
  live?: string;
  featured?: string;
  cyom?: string;
  liquidity_min?: string;
  liquidity_max?: string;
  volume_min?: string;
  volume_max?: string;
  start_date_min?: string;
  start_date_max?: string;
  end_date_min?: string;
  end_date_max?: string;
  tag_id?: string;
  tag_slug?: string;
  order?: string;
  ascending?: string;
  limit?: string;
  cursor?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters = {
    title_search: params.search || '',
    closed: false, // Always exclude closed markets
    live: params.live === 'true' ? true : null,
    featured: params.featured === 'true' ? true : null,
    cyom: params.cyom === 'true' ? true : null,
    liquidity_min: params.liquidity_min ? Number(params.liquidity_min) : null,
    liquidity_max: params.liquidity_max ? Number(params.liquidity_max) : null,
    volume_min: params.volume_min ? Number(params.volume_min) : null,
    volume_max: params.volume_max ? Number(params.volume_max) : null,
    start_date_min: params.start_date_min || null,
    start_date_max: params.start_date_max || null,
    end_date_min: params.end_date_min || null,
    end_date_max: params.end_date_max || null,
    tag_id: params.tag_id
      ? Array.isArray(params.tag_id)
        ? params.tag_id.map(Number)
        : [Number(params.tag_id)]
      : [],
    tag_slug: params.tag_slug || null,
    order: params.order || 'volume',
    ascending: params.ascending === 'true',
  };

  const limit = Number(params.limit) || 20;
  const afterCursor = params.cursor || null;
  
  // Build query string for passing to EventListClient
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== 'cursor') {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, String(v)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  const currentQueryString = queryParams.toString();

  const schemaData = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-[#081321] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-[#07111f]/95 shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur">
        <div className="mx-auto flex max-w-[1880px] items-center justify-between px-7 py-5">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10" aria-hidden="true">
              <div className="absolute left-0 top-0 h-0 w-0 border-y-[11px] border-r-[30px] border-y-transparent border-r-white" />
              <div className="absolute left-1 top-[4px] h-0 w-0 border-y-[7px] border-r-[20px] border-y-transparent border-r-[#07111f]" />
              <div className="absolute bottom-0 left-0 h-0 w-0 border-y-[11px] border-r-[30px] border-y-transparent border-r-white" />
              <div className="absolute bottom-[4px] left-1 h-0 w-0 border-y-[7px] border-r-[20px] border-y-transparent border-r-[#07111f]" />
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-white">{SITE_NAME}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="flex items-center gap-2 text-slate-300 transition hover:text-white">
              <span className="grid h-5 w-5 place-items-center rounded-full border border-slate-500 text-xs">?</span>
              Docs
            </a>
            <RefreshButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1880px] gap-8 px-7 py-6 max-lg:flex-col max-sm:px-4">
        <aside className="w-[405px] flex-shrink-0 max-lg:w-full">
          <div className="sticky top-24 flex max-h-[calc(100vh-118px)] flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-[#091629]/92 shadow-[0_24px_80px_rgba(0,0,0,0.22)] max-lg:max-h-none">
            <div className="flex shrink-0 items-center justify-between px-6 pb-5 pt-6">
              <h2 className="text-lg font-bold tracking-wider text-blue-400">FILTERS</h2>
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <FilterPanel filters={filters} />
          </div>
        </aside>

        <main className="flex h-[calc(100vh-118px)] min-w-0 flex-1 flex-col max-lg:h-auto">
          <div className="mb-6 flex shrink-0 items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">EVENTS</h2>
            <ResultsPerPage limit={limit} />
          </div>

          <Suspense
            fallback={
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-400 mb-4" />
                  <p className="text-slate-400">Loading events...</p>
                </div>
              </div>
            }
          >
            <EventListServer
              filters={filters}
              afterCursor={afterCursor}
              limit={limit}
              currentQueryString={currentQueryString}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
