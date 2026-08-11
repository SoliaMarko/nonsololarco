import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import MetronomeFab from './MetronomeFab';

describe('MetronomeFab', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the button with accessible label', () => {
    render(<MetronomeFab />);
    expect(screen.getByRole('button', { name: 'Metronome' })).toBeDefined();
  });

  it('initially renders pulse ring spans', () => {
    const { container } = render(<MetronomeFab />);
    const rings = container.querySelectorAll('span');
    expect(rings.length).toBe(3);
  });

  it('removes pulse rings after 4.8 seconds', () => {
    const { container } = render(<MetronomeFab />);
    act(() => {
      vi.advanceTimersByTime(4800);
    });
    const rings = container.querySelectorAll('span');
    expect(rings.length).toBe(0);
  });

  it('toggles animation on click', () => {
    const { container } = render(<MetronomeFab />);

    act(() => {
      vi.advanceTimersByTime(4800);
    });
    expect(container.querySelectorAll('span').length).toBe(0);

    act(() => {
      screen.getByRole('button', { name: 'Metronome' }).click();
    });
    expect(container.querySelectorAll('span').length).toBe(3);
  });
});
