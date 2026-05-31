'use client';

import { useRouter } from 'next/navigation';
import SearchBox from './SearchBox';
import FilterSection from './FilterSection';
import { type TagFilterGroup, getAllTagGroups } from '@/lib/tagFilters';
import type { Filters } from '@/types/filters';

interface FilterPanelClientProps {
  filters: Filters;
}

const filterRow =
  'flex cursor-pointer items-center justify-between rounded-md px-0 py-1.5 text-sm text-slate-200 transition hover:text-white';
const inputClass =
  'w-full rounded-md border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
const presetButtonClass = (active: boolean) =>
  `px-3 py-2 rounded-md text-xs font-semibold transition ${
    active
      ? 'bg-blue-600 text-white'
      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
  }`;

// Tag group display info for ONLY CATEGORY filter (API param: tag_slug)
const tagGroupInfo: Record<
  TagFilterGroup,
  { label: string; emoji: string; color: string }
> = {
  crypto: { label: 'Crypto', emoji: '₿', color: 'bg-orange-500' },
  sports: { label: 'Sports', emoji: '⚽', color: 'bg-emerald-500' },
  politics: { label: 'Politics', emoji: '🗳️', color: 'bg-violet-500' },
  entertainment: { label: 'Entertainment', emoji: '🎬', color: 'bg-pink-500' },
  technology: { label: 'Technology', emoji: '💻', color: 'bg-sky-500' },
  markets: { label: 'Markets', emoji: '📈', color: 'bg-cyan-500' },
  science: { label: 'Science', emoji: '🔬', color: 'bg-indigo-500' },
};

export default function FilterPanelClient({ filters }: FilterPanelClientProps) {
  const router = useRouter();

  const handleSearchChange = (query: string) => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'title_search' && value && value !== null && value !== false) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, String(v)));
        } else {
          params.append(key, String(value));
        }
      }
    });
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (key: string, value: boolean) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, 'true');
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleNumberChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleDateChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      const isoDate = new Date(value).toISOString();
      params.set(key, isoDate);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handlePreset = (preset: string) => {
    const params = new URLSearchParams();
    const now = new Date();

    switch (preset) {
      case 'ending-today': {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        params.set('end_date_min', startOfDay.toISOString());
        params.set('end_date_max', endOfDay.toISOString());
        params.set('order', 'endDate');
        params.set('ascending', 'true');
        break;
      }
      case 'ending-tomorrow': {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startOfDay = new Date(tomorrow);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(tomorrow);
        endOfDay.setHours(23, 59, 59, 999);
        params.set('end_date_min', startOfDay.toISOString());
        params.set('end_date_max', endOfDay.toISOString());
        params.set('order', 'endDate');
        params.set('ascending', 'true');
        break;
      }
      case 'ending-soon': {
        const startTime = new Date(now);
        startTime.setHours(Math.floor(now.getHours()) + 12);
        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        params.set('end_date_min', now.toISOString());
        params.set('end_date_max', endTime.toISOString());
        params.set('order', 'endDate');
        params.set('ascending', 'true');
        break;
      }
      case 'live':
        params.set('live', 'true');
        break;
      case 'featured':
        params.set('featured', 'true');
        break;
      case 'high-volume':
        params.set('volume_min', '100000');
        break;
      case 'high-liquidity':
        params.set('liquidity_min', '50000');
        break;
    }

    router.push(`?${params.toString()}`);
  };

  const handleTagSlug = (slug: string) => {
    const params = new URLSearchParams(window.location.search);
    if (filters.tag_slug === slug) {
      params.delete('tag_slug');
    } else {
      params.set('tag_slug', slug);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('order', value);
    params.delete('ascending');
    if (value !== 'featured') {
      params.set('ascending', 'false');
    }
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/');
  };

  const allGroups = getAllTagGroups();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
        <SearchBox onSearch={handleSearchChange} />

        {/* QUICK PRESETS */}
        <FilterSection title="QUICK PRESETS">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePreset('ending-today')}
              className={presetButtonClass(false)}
            >
              🕐 Ending Today
            </button>
            <button
              onClick={() => handlePreset('ending-tomorrow')}
              className={presetButtonClass(false)}
            >
              📅 Ending Tomorrow
            </button>
            <button
              onClick={() => handlePreset('ending-soon')}
              className={presetButtonClass(false)}
            >
              ⚡ Ending Soon
            </button>
            <button
              onClick={() => handlePreset('live')}
              className={presetButtonClass(filters.live === true)}
            >
              🔴 Live Events
            </button>
            <button
              onClick={() => handlePreset('featured')}
              className={presetButtonClass(filters.featured === true)}
            >
              ★ Featured
            </button>
            <button
              onClick={() => handlePreset('high-volume')}
              className={presetButtonClass(filters.volume_min === 100000)}
            >
              📊 High Volume
            </button>
            <button
              onClick={() => handlePreset('high-liquidity')}
              className={presetButtonClass(filters.liquidity_min === 50000)}
            >
              💧 High Liquidity
            </button>
          </div>
        </FilterSection>

        {/* CATEGORIES - ONLY FILTER */}
        <FilterSection title="ONLY CATEGORY">
          {allGroups.map((group) => {
            const info = tagGroupInfo[group];
            return (
              <label key={group} className={filterRow}>
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.tag_slug === group}
                    onChange={() => handleTagSlug(group)}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-950 accent-blue-500"
                  />
                  <span className={`grid h-5 w-5 place-items-center rounded-full ${info.color} text-sm font-bold text-white`}>
                    {info.emoji}
                  </span>
                  {info.label}
                </span>
              </label>
            );
          })}
        </FilterSection>

        {/* LIQUIDITY RANGE */}
        <FilterSection title="LIQUIDITY (USD)">
          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="mb-2 block text-xs text-slate-400">Min</span>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-300">$</span>
                <input
                  type="number"
                  defaultValue={filters.liquidity_min || ''}
                  onChange={(e) => handleNumberChange('liquidity_min', e.target.value)}
                  placeholder="Min"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </label>
            <label>
              <span className="mb-2 block text-xs text-slate-400">Max</span>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-300">$</span>
                <input
                  type="number"
                  defaultValue={filters.liquidity_max || ''}
                  onChange={(e) => handleNumberChange('liquidity_max', e.target.value)}
                  placeholder="Max"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </label>
          </div>
        </FilterSection>

        {/* VOLUME RANGE */}
        <FilterSection title="VOLUME (USD)">
          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="mb-2 block text-xs text-slate-400">Min</span>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-300">$</span>
                <input
                  type="number"
                  defaultValue={filters.volume_min || ''}
                  onChange={(e) => handleNumberChange('volume_min', e.target.value)}
                  placeholder="Min"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </label>
            <label>
              <span className="mb-2 block text-xs text-slate-400">Max</span>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-300">$</span>
                <input
                  type="number"
                  defaultValue={filters.volume_max || ''}
                  onChange={(e) => handleNumberChange('volume_max', e.target.value)}
                  placeholder="Max"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </label>
          </div>
        </FilterSection>

        {/* DATE RANGE */}
        <FilterSection title="RESOLUTION DATE RANGE">
          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="mb-2 block text-xs text-slate-400">Ends After</span>
              <input
                type="date"
                defaultValue={filters.end_date_min ? new Date(filters.end_date_min).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('end_date_min', e.target.value)}
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-2 block text-xs text-slate-400">Ends Before</span>
              <input
                type="date"
                defaultValue={filters.end_date_max ? new Date(filters.end_date_max).toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('end_date_max', e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        </FilterSection>

        {/* SORT BY */}
        <FilterSection title="SORT BY">
          <div className="space-y-1">
            {[
              ['endDate', 'Ending Soon (Soonest First)'],
              ['volume', 'Volume (Highest)'],
              ['liquidity', 'Liquidity (Highest)'],
            ].map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center rounded py-1 text-sm text-slate-200 hover:text-white">
                <input
                  type="radio"
                  name="sort"
                  value={value}
                  checked={filters.order === value}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="h-4 w-4 border-slate-600 bg-slate-950 accent-blue-500"
                />
                <span className="ml-2">{label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <div className="shrink-0 space-y-3 border-t border-slate-700/70 bg-[#091629] px-6 py-5 shadow-[0_-18px_32px_rgba(3,7,18,0.28)]">
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-transparent px-4 py-3 text-sm font-bold text-slate-100 transition hover:border-blue-400/50 hover:bg-slate-800/60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          CLEAR FILTERS
        </button>
      </div>
    </div>
  );
}
