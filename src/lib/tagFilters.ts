// Tag filter groups for client-side filtering
// Groups related tags together since Polymarket has many variants
export const TAG_FILTER_GROUPS = {
  crypto: [
    'crypto',
    'bitcoin',
    'ethereum',
    'altcoins',
    'etf',
    'tokens',
    'web3',
    'defi',
    'nft',
    'stablecoin',
  ],
  sports: [
    'sports',
    'soccer',
    'football',
    'nba',
    'nfl',
    'mlb',
    'hockey',
    'tennis',
    'mma',
    'boxing',
    'golf',
    'rugby',
    'cricket',
    'formula-1',
    'f1',
    'champions-league',
    'europa-league',
    'premier-league',
    'laliga',
    'serie-a',
    'bundesliga',
  ],
  politics: [
    'politics',
    'election',
    'us-election',
    'presidential',
    'congress',
    'senate',
    'governor',
    'senate-races',
    'house-races',
    'ballot',
    'state-election',
    'federal-government',
    'international-affairs',
  ],
  entertainment: [
    'entertainment',
    'tv',
    'movies',
    'music',
    'celebrities',
    'awards',
    'oscars',
    'grammys',
    'streaming',
    'hollywood',
    'controversy',
    'controversies',
    'celebrity',
    'viral',
    'pop-culture',
  ],
  technology: [
    'technology',
    'ai',
    'artificial-intelligence',
    'machine-learning',
    'openai',
    'tech-stocks',
    'startup',
    'ipo',
    'software',
    'hardware',
  ],
  markets: [
    'markets',
    'stocks',
    'commodities',
    'gold',
    'oil',
    'bonds',
    'forex',
    'interest-rates',
    'fed',
    'economic-data',
  ],
  science: [
    'science',
    'space',
    'astronomy',
    'physics',
    'biology',
    'climate',
    'environment',
    'medical',
    'health',
  ],
};

export type TagFilterGroup = keyof typeof TAG_FILTER_GROUPS;

// Get all slugs for a group
export function getTagSlugsForGroup(group: TagFilterGroup): string[] {
  return TAG_FILTER_GROUPS[group] || [];
}

// Get all available groups
export function getAllTagGroups(): TagFilterGroup[] {
  return Object.keys(TAG_FILTER_GROUPS) as TagFilterGroup[];
}

// Check if a tag slug matches any hidden group
export function shouldHideEvent(
  eventTags: Array<{ slug?: string | null }>,
  hideGroups: TagFilterGroup[]
): boolean {
  if (!eventTags || eventTags.length === 0) return false;
  if (hideGroups.length === 0) return false;

  const hiddenSlugs = hideGroups.flatMap((group) =>
    getTagSlugsForGroup(group)
  );

  return eventTags.some((tag) =>
    tag.slug ? hiddenSlugs.includes(tag.slug.toLowerCase()) : false
  );
}
