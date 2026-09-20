import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CeilingLamp from './CeilingLamp';
import { LAMP_ASPECT } from './ceiling-lamp-illustration.const';

const getLampBox = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('CeilingLamp', () => {
  it('renders decoratively without a title', () => {
    const { container } = render(<CeilingLamp />);

    expect(getLampBox(container).getAttribute('aria-hidden')).toBe('true');
    expect(getLampBox(container).getAttribute('role')).toBeNull();
  });

  it('exposes an accessible name when given a title', () => {
    render(<CeilingLamp title="Ceiling lamp" />);

    expect(screen.getByRole('img', { name: 'Ceiling lamp' })).toBeDefined();
  });

  it('derives width from height on the 512:840 aspect ratio', () => {
    const { container } = render(<CeilingLamp height={840} />);

    expect(getLampBox(container).style.height).toBe('840px');
    expect(getLampBox(container).style.width).toBe(`${840 * LAMP_ASPECT}px`);
  });

  it('keeps both body renders mounted so the states cross-fade', () => {
    const { container } = render(<CeilingLamp />);
    const sources = Array.from(container.querySelectorAll('img')).map((img) => img.src);

    expect(sources.some((src) => src.includes('lamp-on'))).toBe(true);
    expect(sources.some((src) => src.includes('lamp-off'))).toBe(true);
  });

  it('layers the pull knob separately from the body', () => {
    const { container } = render(<CeilingLamp />);
    const sources = Array.from(container.querySelectorAll('img')).map((img) => img.src);

    expect(sources.some((src) => src.includes('lamp-knob'))).toBe(true);
  });

  it('places the knob so its bottom edge is the bottom of the lamp box', () => {
    const { container } = render(<CeilingLamp height={840} />);
    const knob = Array.from(container.querySelectorAll('img')).find((img) =>
      img.src.includes('lamp-knob'),
    );

    // 688/840 of the way down, 152/840 tall — together exactly 100%.
    expect(knob?.style.insetBlockStart).toBe(`${(688 / 840) * 100}%`);
    expect(knob?.style.width).toBe(`${(86 / 512) * 100}%`);
  });
});
