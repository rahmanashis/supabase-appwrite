import { describe, it, expect } from 'vitest';
import { validateService, isValidUrl } from './validation';

describe('isValidUrl', () => {
  it('accepts valid http and https URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  it('rejects invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('ftp://example.com')).toBe(false);
  });
});

describe('validateService', () => {
  it('returns errors for empty fields', () => {
    const errors = validateService({ name: '', type: '', url: '' });
    expect(errors.name).toBeDefined();
    expect(errors.type).toBeDefined();
    expect(errors.url).toBeDefined();
  });

  it('returns no errors for valid service', () => {
    const errors = validateService({
      name: 'Coolify',
      type: 'docker',
      url: 'https://coolify.local',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns an error for invalid URL', () => {
    const errors = validateService({
      name: 'Coolify',
      type: 'docker',
      url: 'invalid-url',
    });
    expect(errors.url).toBeDefined();
  });
});
