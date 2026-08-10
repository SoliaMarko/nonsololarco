import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BeatDots from './BeatDots';

describe('BeatDots', () => {
  it('renders the correct number of dots for 4/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={4} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(4);
  });

  it('renders the correct number of dots for 3/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={3} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(3);
  });

  it('renders the correct number of dots for 6/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={6} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(6);
  });

  it('renders all dots as spans inside a wrapper', () => {
    const { container } = render(<BeatDots activeBeat={0} signature={4} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeDefined();
    expect(wrapper?.children.length).toBe(4);
  });
});
