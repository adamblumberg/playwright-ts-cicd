import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  buildQueryString,
  truncate,
  slugToTitle,
} from '../../src/utils/helpers';

describe('formatPrice', () => {
  it('formats a whole-number price with two decimal places', () => {
    expect(formatPrice(12)).toBe('$12.00');
  });

  it('formats a price with cents', () => {
    expect(formatPrice(9.99)).toBe('$9.99');
  });

  it('rounds to two decimal places', () => {
    expect(formatPrice(1.005)).toBe('$1.01');
  });

  it('formats zero as $0.00', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('throws for a negative price', () => {
    expect(() => formatPrice(-5)).toThrow(RangeError);
  });

  it('throws for NaN', () => {
    expect(() => formatPrice(NaN)).toThrow(RangeError);
  });

  it('throws for Infinity', () => {
    expect(() => formatPrice(Infinity)).toThrow(RangeError);
  });
});

describe('buildQueryString', () => {
  it('builds a simple query string', () => {
    expect(buildQueryString({ page: 1 })).toBe('page=1');
  });

  it('combines multiple params', () => {
    const result = buildQueryString({ page: 2, sort: 'name,asc' });
    expect(result).toContain('page=2');
    expect(result).toContain('sort=name%2Casc');
  });

  it('omits null values', () => {
    const result = buildQueryString({ page: 1, sort: null });
    expect(result).toBe('page=1');
  });

  it('omits undefined values', () => {
    const result = buildQueryString({ page: 1, by_brand: undefined });
    expect(result).toBe('page=1');
  });

  it('returns an empty string when all values are null', () => {
    expect(buildQueryString({ foo: null, bar: undefined })).toBe('');
  });
});

describe('truncate', () => {
  it('returns the original string when it fits within maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates and appends ellipsis when too long', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  it('truncates to exactly maxLength including ellipsis', () => {
    const result = truncate('1234567890', 7);
    expect(result).toHaveLength(7);
    expect(result.endsWith('...')).toBe(true);
  });

  it('returns unchanged string when length equals maxLength', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('throws when maxLength is less than 4', () => {
    expect(() => truncate('Hi', 3)).toThrow(RangeError);
  });
});

describe('slugToTitle', () => {
  it('converts a hyphenated slug to title case', () => {
    expect(slugToTitle('bolt-cutters-large')).toBe('Bolt Cutters Large');
  });

  it('handles a single-word slug', () => {
    expect(slugToTitle('pliers')).toBe('Pliers');
  });

  it('capitalises each word independently', () => {
    expect(slugToTitle('long-nose-pliers')).toBe('Long Nose Pliers');
  });

  it('handles an already-capitalised slug gracefully', () => {
    expect(slugToTitle('Hammer')).toBe('Hammer');
  });
});
