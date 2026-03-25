/**
 * Utility helpers shared across the test suite.
 * These pure functions are easy to unit-test in isolation.
 */

/**
 * Formats a raw numeric price as a localised currency string.
 * @example formatPrice(12.5) → "$12.50"
 */
export function formatPrice(price: number, currency = 'USD', locale = 'en-US'): string {
  if (!Number.isFinite(price) || price < 0) {
    throw new RangeError(`Price must be a non-negative finite number, got: ${price}`);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Builds a URL search-parameter string from a plain object,
 * omitting keys whose value is null or undefined.
 * @example buildQueryString({ page: 2, sort: 'name,asc' }) → "page=2&sort=name%2Casc"
 */
export function buildQueryString(params: Record<string, string | number | null | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}

/**
 * Truncates a string to `maxLength` characters and appends an ellipsis
 * when truncation occurs.
 * @example truncate('Hello World', 7) → "Hell..."
 */
export function truncate(text: string, maxLength: number): string {
  if (maxLength < 4) throw new RangeError('maxLength must be at least 4');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Converts a product slug into a human-readable title.
 * @example slugToTitle('bolt-cutters-large') → "Bolt Cutters Large"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
