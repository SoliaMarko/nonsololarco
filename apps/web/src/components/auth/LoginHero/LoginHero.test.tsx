import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoginHero from './LoginHero';

describe('LoginHero', () => {
  it('renders the brand logo', () => {
    render(<LoginHero />);

    expect(screen.getByRole('img', { name: 'nonsololarco' })).toBeDefined();
  });

  it('sets the emerald background via inline style', () => {
    const { container } = render(<LoginHero />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.style.backgroundColor).toBe('var(--color-emerald-deep)');
  });

  it('renders the logo in the on-brand tone so the notes are the fixed yellow', () => {
    const { container } = render(<LoginHero />);

    const noteFills = Array.from(container.querySelectorAll('ellipse')).map((node) =>
      node.getAttribute('fill'),
    );

    expect(noteFills.length).toBeGreaterThan(0);
    expect(noteFills.every((fill) => fill === '#e8e07a')).toBe(true);
  });
});
