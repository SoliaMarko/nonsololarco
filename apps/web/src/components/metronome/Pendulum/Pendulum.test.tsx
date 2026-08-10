import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Pendulum from './Pendulum';

describe('Pendulum', () => {
  it('renders the wrapper with child elements', () => {
    const { container } = render(<Pendulum bpm={120} playing={false} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeDefined();
    expect(wrapper?.childElementCount).toBeGreaterThanOrEqual(3);
  });

  it('sets the --beat CSS variable based on BPM', () => {
    const { container } = render(<Pendulum bpm={120} playing={true} />);
    const arm = container.querySelector('[style*="--beat"]');
    expect(arm).toBeDefined();
    expect(arm?.getAttribute('style')).toContain('0.500s');
  });

  it('computes 1-second beat duration at 60 BPM', () => {
    const { container } = render(<Pendulum bpm={60} playing={true} />);
    const arm = container.querySelector('[style*="--beat"]');
    expect(arm?.getAttribute('style')).toContain('1.000s');
  });
});
