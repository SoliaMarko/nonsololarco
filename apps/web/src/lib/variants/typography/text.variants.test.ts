import { twMerge } from 'tailwind-merge';
import { describe, expect, it } from 'vitest';

import { textVariants } from './text.variants';

describe('textVariants', () => {
  it('emits font-normal for the default weight', () => {
    const classes = textVariants();

    expect(classes).toContain('font-normal');
  });

  it('emits stock Tailwind weight classes for every variant', () => {
    expect(textVariants({ weight: 'medium' })).toContain('font-medium');
    expect(textVariants({ weight: 'semibold' })).toContain('font-semibold');
    expect(textVariants({ weight: 'bold' })).toContain('font-bold');
  });

  /**
   * The bug: when the default emitted `font-regular` (a custom class),
   * tailwind-merge couldn't classify it as a font-weight utility, so a
   * `font-medium` passed through `className` silently lost. Now that the
   * default emits `font-normal` (stock Tailwind), tailwind-merge correctly
   * drops it in favour of a later weight.
   */
  it('allows tailwind-merge to override the default weight', () => {
    const base = textVariants({ weight: 'regular' });
    const merged = twMerge(base, 'font-bold');

    expect(merged).toContain('font-bold');
    expect(merged).not.toContain('font-normal');
  });

  it('allows tailwind-merge to override medium with semibold', () => {
    const base = textVariants({ weight: 'medium' });
    const merged = twMerge(base, 'font-semibold');

    expect(merged).toContain('font-semibold');
    expect(merged).not.toContain('font-medium');
  });
});
