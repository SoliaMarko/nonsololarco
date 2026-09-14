import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import VintageMetronome from './VintageMetronome';

describe('VintageMetronome', () => {
  it('renders decoratively without a title', () => {
    const { container } = render(<VintageMetronome />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBeNull();
  });

  it('exposes an accessible name when given a title', () => {
    render(<VintageMetronome title="Metronome" />);
    expect(screen.getByRole('img', { name: 'Metronome' })).toBeDefined();
  });

  it('renders the BPM numerals in the detailed variant', () => {
    render(<VintageMetronome title="Metronome" variant="detailed" />);
    expect(screen.getByText('40')).toBeDefined();
    expect(screen.getByText('200')).toBeDefined();
  });

  it('omits the BPM numerals in the compact variant', () => {
    render(<VintageMetronome title="Metronome" variant="compact" />);
    expect(screen.queryByText('40')).toBeNull();
    expect(screen.queryByText('200')).toBeNull();
  });

  it('renders the M.M. key plate only in the detailed variant', () => {
    const { rerender } = render(<VintageMetronome title="Metronome" variant="detailed" />);
    expect(screen.getByText('M.M')).toBeDefined();

    rerender(<VintageMetronome title="Metronome" variant="compact" />);
    expect(screen.queryByText('M.M')).toBeNull();
  });

  it('derives width from height on the 180:268 aspect ratio', () => {
    const { container } = render(<VintageMetronome height={268} />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('height')).toBe('268');
    expect(svg?.getAttribute('width')).toBe('180');
  });

  it('rests paused by default so the arm holds position', () => {
    const { container } = render(<VintageMetronome />);
    const arm = container.querySelector('g[style*="transform-box"]') as SVGGElement | null;
    // The animation is always attached; only its play state toggles, so the
    // arm freezes in place rather than snapping back on stop.
    expect(arm?.style.animation).toContain('metronome-swing');
    expect(arm?.style.animationPlayState).toBe('paused');
  });

  it('runs the swing when isSwinging is set', () => {
    const { container } = render(<VintageMetronome isSwinging />);
    const arm = container.querySelector('g[style*="transform-box"]') as SVGGElement | null;
    expect(arm?.style.animationPlayState).toBe('running');
  });

  it('runs on pointer enter and pauses on leave', async () => {
    const { container } = render(<VintageMetronome />);
    const svg = container.querySelector('svg')!;
    const arm = () => container.querySelector('g[style*="transform-box"]') as SVGGElement;

    await userEvent.hover(svg);
    expect(arm().style.animationPlayState).toBe('running');

    await userEvent.unhover(svg);
    expect(arm().style.animationPlayState).toBe('paused');
  });

  it('applies the beat duration to the swing', () => {
    const { container } = render(<VintageMetronome beatSeconds={1.2} isSwinging />);
    const arm = container.querySelector('g[style*="transform-box"]');
    expect((arm as SVGGElement | null)?.style.animation).toContain('1.2s');
  });

  it('generates unique gradient ids across instances', () => {
    const { container } = render(
      <>
        <VintageMetronome />
        <VintageMetronome />
      </>,
    );
    const gradients = Array.from(container.querySelectorAll('linearGradient'));
    const ids = gradients.map((g) => g.getAttribute('id'));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
