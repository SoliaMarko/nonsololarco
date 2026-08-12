import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetronomeButton from './MetronomeButton';

describe('MetronomeButton', () => {
  it('links to the metronome page', () => {
    render(<MetronomeButton />);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/metronome');
  });

  it('has an accessible name on the link', () => {
    render(<MetronomeButton />);
    expect(screen.getByRole('link', { name: 'Metronome' })).toBeDefined();
  });

  it('keeps the illustration decorative so the link owns the name', () => {
    const { container } = render(<MetronomeButton />);
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders a smaller illustration in the header variant', () => {
    const { container } = render(<MetronomeButton variant="header" />);
    expect(container.querySelector('svg')?.getAttribute('height')).toBe('30');
  });

  it('renders a larger illustration in the fab variant', () => {
    const { container } = render(<MetronomeButton variant="fab" />);
    expect(container.querySelector('svg')?.getAttribute('height')).toBe('40');
  });

  it('merges an external className', () => {
    render(<MetronomeButton className="hidden md:inline-flex" />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('hidden');
    expect(link.className).toContain('md:inline-flex');
  });
});
