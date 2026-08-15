export function ctaLabel(kind) {
  return kind === 'game' ? 'Play' : 'Open';
}

export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function isKind(value) {
  return value === 'game' || value === 'app';
}
