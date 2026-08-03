import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Logo from './Logo';

const svgText = (container: HTMLElement, content: string): SVGTextElement | undefined =>
  Array.from(container.querySelectorAll('text')).find((node) => node.textContent === content);

describe('Logo', () => {
  it('renders with an accessible label', () => {
    render(<Logo variant="lockup" />);

    expect(screen.getByRole('img', { name: 'nonsololarco' })).toBeDefined();
  });

  it('renders each variant', () => {
    const { container: mark } = render(<Logo variant="mark" />);
    expect(mark.querySelector('rect')).not.toBeNull();

    const { container: wordmark } = render(<Logo variant="wordmark" />);
    expect(svgText(wordmark, 'non')).toBeDefined();
    expect(svgText(wordmark, 'arco')).toBeDefined();

    const { container: lockup } = render(<Logo variant="lockup" />);
    expect(svgText(lockup, 'MUSIC COMMUNITY')).toBeDefined();
  });

  it('shows the subtitle for the requested locale', () => {
    const { container } = render(<Logo variant="lockup" locale="ua" />);

    expect(svgText(container, 'МУЗИЧНА СПІЛЬНОТА')).toBeDefined();
    expect(svgText(container, 'MUSIC COMMUNITY')).toBeUndefined();
  });

  describe('default tone', () => {
    it('paints text and notes with theme-aware tokens', () => {
      const { container } = render(<Logo variant="lockup" />);

      expect(svgText(container, 'so')?.getAttribute('fill')).toBe('var(--color-fg-primary)');
      expect(svgText(container, 'non')?.getAttribute('fill')).toBe('var(--color-fg-tertiary)');
      expect(container.querySelector('ellipse')?.getAttribute('fill')).toBe(
        'var(--color-emerald-main)',
      );
      expect(svgText(container, 'MUSIC COMMUNITY')?.getAttribute('fill')).toBe(
        'var(--color-emerald-main)',
      );
    });
  });

  describe('on-brand tone', () => {
    it('uses a light palette so text stays legible on the emerald background', () => {
      const { container } = render(<Logo variant="lockup" tone="on-brand" />);

      expect(svgText(container, 'so')?.getAttribute('fill')).toBe('var(--color-primary-light)');
      expect(svgText(container, 'o')?.getAttribute('fill')).toBe('var(--color-primary-light)');
    });

    it('paints the musical notes with the fixed yellow', () => {
      const { container } = render(<Logo variant="lockup" tone="on-brand" />);

      const noteFills = Array.from(container.querySelectorAll('ellipse')).map((node) =>
        node.getAttribute('fill'),
      );

      expect(noteFills.length).toBeGreaterThan(0);
      expect(noteFills.every((fill) => fill === '#e8e07a')).toBe(true);
    });

    it('differs from the default tone for the same variant', () => {
      const { container: def } = render(<Logo variant="lockup" />);
      const { container: brand } = render(<Logo variant="lockup" tone="on-brand" />);

      expect(svgText(brand, 'so')?.getAttribute('fill')).not.toBe(
        svgText(def, 'so')?.getAttribute('fill'),
      );
    });
  });
});
