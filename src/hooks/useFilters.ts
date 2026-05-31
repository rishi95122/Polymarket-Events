'use client';

import { useState, useCallback } from 'react';
import type { Filters, FilterKey } from '@/types/filters';

const defaultFilters: Filters = {
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
};

export function useFilters() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const updateFilter = useCallback(
    (key: FilterKey, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const updateMultipleFilters = useCallback(
    (updates: Partial<Filters>) => {
      setFilters((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    updateFilter,
    updateMultipleFilters,
    resetFilters,
  };
}