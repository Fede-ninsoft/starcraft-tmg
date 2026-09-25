import type { GameTerm } from '@/content/gameTerms';
import type { SupportedLocale } from '@/i18n/types';

/** Keep English card keywords searchable alongside their Spanish explanations. */
export function normalizeTermSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function searchGameTerms(
  terms: readonly GameTerm[],
  query: string,
  locale: SupportedLocale,
): GameTerm[] {
  const normalizedQuery = normalizeTermSearch(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });

  if (tokens.length === 0) {
    return [...terms].sort((a, b) => collator.compare(a.name[locale], b.name[locale]));
  }

  return terms
    .map((term) => {
      const names = [term.name.es, term.name.en].map(normalizeTermSearch);
      const aliases = [...(term.aliases?.es ?? []), ...(term.aliases?.en ?? [])].map(normalizeTermSearch);
      const definitions = [term.summary.es, term.summary.en].map(normalizeTermSearch);
      const searchable = [...names, ...aliases, ...definitions].join(' ');
      if (!tokens.every((token) => searchable.includes(token))) return null;

      const rank = names.some((name) => name === normalizedQuery) ? 5
        : names.some((name) => name.startsWith(normalizedQuery)) ? 4
          : aliases.some((alias) => alias === normalizedQuery || alias.startsWith(normalizedQuery)) ? 3
            : names.some((name) => tokens.every((token) => name.includes(token))) ? 2
              : 1;
      return { term, rank };
    })
    .filter((match): match is { term: GameTerm; rank: number } => match !== null)
    .sort((a, b) => b.rank - a.rank || collator.compare(a.term.name[locale], b.term.name[locale]))
    .map(({ term }) => term);
}
