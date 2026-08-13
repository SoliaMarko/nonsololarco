import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import BpmControl from './BpmControl';

function setup(bpm = 92) {
  const onBpmChange = vi.fn();
  const onTap = vi.fn();
  const utils = render(<BpmControl bpm={bpm} onBpmChange={onBpmChange} onTap={onTap} />);
  return { ...utils, onBpmChange, onTap };
}

describe('BpmControl', () => {
  it('renders the BPM value, unit label and tempo name', () => {
    setup(92);
    expect(screen.getByText('92')).toBeDefined();
    expect(screen.getByText('BPM')).toBeDefined();
    expect(screen.getByText('Andante · кроком')).toBeDefined();
  });

  it('increments the BPM by one', async () => {
    const { onBpmChange } = setup(92);
    await userEvent.click(screen.getByRole('button', { name: 'Increase BPM' }));
    expect(onBpmChange).toHaveBeenCalledWith(93);
  });

  it('decrements the BPM by one', async () => {
    const { onBpmChange } = setup(92);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease BPM' }));
    expect(onBpmChange).toHaveBeenCalledWith(91);
  });

  it('clamps at the maximum when incrementing', async () => {
    const { onBpmChange } = setup(240);
    await userEvent.click(screen.getByRole('button', { name: 'Increase BPM' }));
    expect(onBpmChange).toHaveBeenCalledWith(240);
  });

  it('clamps at the minimum when decrementing', async () => {
    const { onBpmChange } = setup(40);
    await userEvent.click(screen.getByRole('button', { name: 'Decrease BPM' }));
    expect(onBpmChange).toHaveBeenCalledWith(40);
  });

  it('calls onTap when TAP is clicked', async () => {
    const { onTap } = setup();
    await userEvent.click(screen.getByText('TAP'));
    expect(onTap).toHaveBeenCalledOnce();
  });
});
