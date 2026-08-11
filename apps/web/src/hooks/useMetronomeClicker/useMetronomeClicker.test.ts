import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMetronomeClicker } from './useMetronomeClicker';

describe('useMetronomeClicker', () => {
  it('returns stable function references across renders', () => {
    const { result, rerender } = renderHook(() => useMetronomeClicker());
    const first = result.current;
    rerender();
    expect(result.current.scheduleClick).toBe(first.scheduleClick);
    expect(result.current.getContext).toBe(first.getContext);
  });

  it('exposes getContext and scheduleClick', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    expect(typeof result.current.getContext).toBe('function');
    expect(typeof result.current.scheduleClick).toBe('function');
  });

  it('does not throw when Web Audio is unavailable', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    expect(() => result.current.scheduleClick(true)).not.toThrow();
    expect(() => result.current.scheduleClick(false)).not.toThrow();
    expect(() => result.current.getContext()).not.toThrow();
  });
});
