export interface Filters {
  title_search: string;
  closed: boolean | null;
  live: boolean | null;
  featured: boolean | null;
  cyom: boolean | null;
  liquidity_min: number | null;
  liquidity_max: number | null;
  volume_min: number | null;
  volume_max: number | null;
  start_date_min: string | null;
  start_date_max: string | null;
  end_date_min: string | null;
  end_date_max: string | null;
  tag_id: number[];
  tag_slug: string | null;
  order: string;
  ascending: boolean;
}

export type FilterKey = keyof Filters;