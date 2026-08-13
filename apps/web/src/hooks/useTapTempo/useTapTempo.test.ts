import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTapTempo } from './useTapTempo';

describe('useTapTempo', () => {
  it('returns a stable function reference', () => {
    const { result, rerender } = renderHook(() => useTapTempo());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('does not call back on the first tap', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTapTempo());

    vi.spyOn(performance, 'now').mockReturnValue(0);
    result.current(callback);
    expect(callback).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('calls back with BPM after two taps', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTapTempo());
    const perfSpy = vi.spyOn(performance, 'now');

    perfSpy.mockReturnValue(0);
    result.current(callback);

    perfSpy.mockReturnValue(500);
    result.current(callback);

    expect(callback).toHaveBeenCalledWith(120);

    vi.restoreAllMocks();
  });

  it('averages multiple taps', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTapTempo());
    const perfSpy = vi.spyOn(performance, 'now');

    perfSpy.mockReturnValue(0);
    result.current(callback);

    perfSpy.mockReturnValue(500);
    result.current(callback);

    perfSpy.mockReturnValue(1000);
    result.current(callback);

    expect(callback).toHaveBeenLastCalledWith(120);

    vi.restoreAllMocks();
  });

  it('discards taps older than 3 seconds', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTapTempo());
    const perfSpy = vi.spyOn(performance, 'now');

    perfSpy.mockReturnValue(0);
    result.current(callback);

    perfSpy.mockReturnValue(500);
    result.current(callback);

    perfSpy.mockReturnValue(4000);
    result.current(callback);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.restoreAllMocks();
  });

  it('clamps BPM to valid range', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useTapTempo());
    const perfSpy = vi.spyOn(performance, 'now');

    perfSpy.mockReturnValue(0);
    result.current(callback);

    perfSpy.mockReturnValue(10);
    result.current(callback);

    expect(callback).toHaveBeenCalledWith(240);

    vi.restoreAllMocks();
  });
});
