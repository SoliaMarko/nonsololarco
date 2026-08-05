import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLockedHeight } from './useLockedHeight';

/** jsdom always reports 0 for offsetHeight, so stub a real measurement. */
function stubHeight(element: HTMLElement | null, height: number) {
  if (!element) return;
  vi.spyOn(element, 'offsetHeight', 'get').mockReturnValue(height);
}

describe('useLockedHeight', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('reports no minHeight while unlocked', () => {
    const { result } = renderHook(() => useLockedHeight<HTMLDivElement>(false));

    expect(result.current.minHeight).toBeUndefined();
  });

  it('locks the measured height when it becomes locked', () => {
    const element = document.createElement('div');
    stubHeight(element, 420);

    const { rerender, result } = renderHook(
      ({ isLocked }) => {
        const locked = useLockedHeight<HTMLDivElement>(isLocked);
        locked.ref.current = element;
        return locked;
      },
      { initialProps: { isLocked: false } },
    );

    rerender({ isLocked: true });

    expect(result.current.minHeight).toBe(420);
  });

  it('releases the lock when it becomes unlocked', () => {
    const element = document.createElement('div');
    stubHeight(element, 420);

    const { rerender, result } = renderHook(
      ({ isLocked }) => {
        const locked = useLockedHeight<HTMLDivElement>(isLocked);
        locked.ref.current = element;
        return locked;
      },
      { initialProps: { isLocked: true } },
    );

    expect(result.current.minHeight).toBe(420);

    rerender({ isLocked: false });

    expect(result.current.minHeight).toBeUndefined();
  });

  it('does not re-measure while it stays locked', () => {
    const element = document.createElement('div');
    stubHeight(element, 420);

    const { rerender, result } = renderHook(
      ({ isLocked }) => {
        const locked = useLockedHeight<HTMLDivElement>(isLocked);
        locked.ref.current = element;
        return locked;
      },
      { initialProps: { isLocked: true } },
    );

    // Content shrinks mid-fetch — the lock must hold the original height.
    stubHeight(element, 0);
    rerender({ isLocked: true });

    expect(result.current.minHeight).toBe(420);
  });

  it('yields undefined when there is no element to measure', () => {
    const { rerender, result } = renderHook(
      ({ isLocked }) => useLockedHeight<HTMLDivElement>(isLocked),
      { initialProps: { isLocked: false } },
    );

    rerender({ isLocked: true });

    expect(result.current.minHeight).toBeUndefined();
  });
});
