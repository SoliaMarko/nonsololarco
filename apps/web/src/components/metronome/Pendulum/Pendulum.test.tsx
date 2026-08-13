import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Pendulum from './Pendulum';

/** Reads the arm's rotation in degrees out of its inline transform. */
function armAngle(container: HTMLElement): number | null {
  const arm = container.querySelector('[style*="rotate"]');
  const match = arm?.getAttribute('style')?.match(/rotate\((-?[\d.]+)deg\)/);
  return match?.[1] ? Number(match[1]) : null;
}

describe('Pendulum', () => {
  it('renders the body, arm and pivot', () => {
    const { container } = render(
      <Pendulum getBeatPosition={() => null} playing={false} />,
    );
    expect(container.firstElementChild?.childElementCount).toBeGreaterThanOrEqual(3);
  });

  it('holds the arm upright while stopped', () => {
    const { container } = render(
      <Pendulum getBeatPosition={() => 0.5} playing={false} />,
    );
    expect(armAngle(container)).toBe(0);
  });

  it('parks at the left extreme before the first beat lands', async () => {
    const { container } = render(<Pendulum getBeatPosition={() => null} playing />);
    await vi.waitFor(() => expect(armAngle(container)).toBe(-14));
  });

  it('sits at the left extreme on a whole beat', async () => {
    const { container } = render(<Pendulum getBeatPosition={() => 0} playing />);
    await vi.waitFor(() => expect(armAngle(container)).toBe(-14));
  });

  it('sits at the right extreme one beat later', async () => {
    const { container } = render(<Pendulum getBeatPosition={() => 1} playing />);
    await vi.waitFor(() => expect(armAngle(container)).toBe(14));
  });

  it('passes through vertical halfway between beats', async () => {
    const { container } = render(<Pendulum getBeatPosition={() => 0.5} playing />);
    await vi.waitFor(() => expect(Math.abs(armAngle(container) ?? 99)).toBeLessThan(0.01));
  });
});
