import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MenuIcon from './MenuIcon';

describe('MenuIcon', () => {
  it('renders as a decorative image when no title is provided', () => {
    const { container } = render(<MenuIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders as an accessible image when title is provided', () => {
    render(<MenuIcon title="Open menu" />);
    expect(screen.getByRole('img', { name: 'Open menu' })).toBeDefined();
  });

  it('uses the given size', () => {
    const { container } = render(<MenuIcon size={32} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('falls back to size 24 when size is omitted', () => {
    const { container } = render(<MenuIcon />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
  });
});
