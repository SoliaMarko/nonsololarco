import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TimeSignatureDef } from '@/src/lib/types/metronome.types';

import BeatDots from './BeatDots';

const sig = (beats: number, label: string): TimeSignatureDef => ({ beats, label });

describe('BeatDots', () => {
  it('renders the correct number of dots for 4/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={sig(4, '4/4')} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(4);
  });

  it('renders the correct number of dots for 3/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={sig(3, '3/4')} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(3);
  });

  it('renders the correct number of dots for 6/4 time', () => {
    const { container } = render(<BeatDots activeBeat={-1} signature={sig(6, '6/4')} />);
    const dots = container.querySelectorAll('span');
    expect(dots.length).toBe(6);
  });

  it('renders all dots as spans inside a wrapper', () => {
    const { container } = render(<BeatDots activeBeat={0} signature={sig(4, '4/4')} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeDefined();
    expect(wrapper?.children.length).toBe(4);
  });
});
