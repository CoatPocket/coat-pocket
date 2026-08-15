export type Kind = 'game' | 'app';
export type Filter = 'all' | Kind;

export function ctaLabel(kind: Kind): 'Play' | 'Open' {
  return kind === 'game' ? 'Play' : 'Open';
}

export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isKind(value: string | null): value is Kind {
  return value === 'game' || value === 'app';
}
