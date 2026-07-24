import { describe, it, expect } from 'vitest';
import {
  validateService,
  isValidUrl,
  isValidEmail,
  isValidPassword,
  validateAuth,
} from './validation';

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

describe('auth validation', () => {
  it('validates email addresses', () => {
    expect(isValidEmail('person@example.com')).toBe(true);
    expect(isValidEmail('person@example')).toBe(false);
  });

  it('requires passwords to be at least 6 characters', () => {
    expect(isValidPassword('secret')).toBe(true);
    expect(isValidPassword('short')).toBe(false);
  });

  it('returns no errors for valid sign in data', () => {
    const errors = validateAuth({
      email: 'person@example.com',
      password: 'secret123',
      confirmPassword: undefined,
    });

    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('requires matching confirmation for sign up data', () => {
    const errors = validateAuth({
      email: 'person@example.com',
      password: 'secret123',
      confirmPassword: 'different',
    });

    expect(errors.confirmPassword).toBe('Passwords do not match.');
  });
});
