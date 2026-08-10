import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMetronomeClicker } from './useMetronomeClicker';

describe('useMetronomeClicker', () => {
  it('returns a stable function reference across renders', () => {
    const { result, rerender } = renderHook(() => useMetronomeClicker());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('returns a callable function', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    expect(typeof result.current).toBe('function');
  });

  it('does not throw when AudioContext is unavailable', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    expect(() => result.current(true)).not.toThrow();
    expect(() => result.current(false)).not.toThrow();
  });
});
