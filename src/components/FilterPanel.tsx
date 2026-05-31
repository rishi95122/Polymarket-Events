import FilterPanelClient from './FilterPanelClient';
import type { Filters } from '@/types/filters';

interface FilterPanelProps {
  filters: Filters;
}

export default function FilterPanel({ filters }: FilterPanelProps) {
  return <FilterPanelClient filters={filters} />;
}