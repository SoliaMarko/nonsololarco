import { describe, expect, it } from 'vitest';

import { LogoColors } from '../../types/ui/logo.types';
import { LOGO_COLORS, LOGO_SUBTITLE, MARK_SIZE, WORDMARK_SCALE } from './logo.const';

const COLOR_KEYS: (keyof LogoColors)[] = [
  'accent',
  'dot',
  'muted',
  'note',
  'primary',
  'squiggle',
  'subtitle',
];

describe('LOGO_COLORS', () => {
  it('exposes default and on-brand tones', () => {
    expect(Object.keys(LOGO_COLORS).sort()).toEqual(['default', 'on-brand']);
  });

  it('defines every color slot for each tone', () => {
    for (const tone of Object.values(LOGO_COLORS)) {
      for (const key of COLOR_KEYS) {
        expect(tone[key]).toBeTruthy();
      }
    }
  });

  it('uses theme-aware tokens for the default tone', () => {
    expect(LOGO_COLORS.default.note).toBe('var(--color-emerald-main)');
    expect(LOGO_COLORS.default.primary).toBe('var(--color-fg-primary)');
    expect(LOGO_COLORS.default.muted).toBe('var(--color-fg-tertiary)');
  });

  it('pins the on-brand note to a fixed yellow so it is identical in light and dark themes', () => {
    // The emerald hero background is a fixed dark green in both themes, so the
    // note color must not flip with the theme token.
    expect(LOGO_COLORS['on-brand'].note).toBe('#e8e07a');
    expect(LOGO_COLORS['on-brand'].note.startsWith('var(')).toBe(false);
  });

  it('uses a light palette for on-brand text and accents', () => {
    expect(LOGO_COLORS['on-brand'].primary).toBe('var(--color-primary-light)');
    expect(LOGO_COLORS['on-brand'].dot).toBe('var(--color-primary-light)');
    expect(LOGO_COLORS['on-brand'].squiggle).toBe('var(--color-emerald-light)');
  });

  it('differs from the default tone on the key legibility slots', () => {
    expect(LOGO_COLORS['on-brand'].note).not.toBe(LOGO_COLORS.default.note);
    expect(LOGO_COLORS['on-brand'].primary).not.toBe(LOGO_COLORS.default.primary);
    expect(LOGO_COLORS['on-brand'].muted).not.toBe(LOGO_COLORS.default.muted);
  });
});

describe('logo sizing maps', () => {
  it('provides a mark size for every logo size', () => {
    expect(MARK_SIZE).toMatchObject({ xs: 24, sm: 32, md: 48, lg: 64, xl: 80 });
  });

  it('provides a wordmark scale for every logo size', () => {
    expect(WORDMARK_SCALE.lg).toBe(1);
    expect(WORDMARK_SCALE.xs).toBeLessThan(WORDMARK_SCALE.xl);
  });
});

describe('LOGO_SUBTITLE', () => {
  it('has a subtitle for each supported locale', () => {
    expect(LOGO_SUBTITLE.en).toBe('MUSIC COMMUNITY');
    expect(LOGO_SUBTITLE.it).toBeTruthy();
    expect(LOGO_SUBTITLE.ua).toBeTruthy();
  });
});
