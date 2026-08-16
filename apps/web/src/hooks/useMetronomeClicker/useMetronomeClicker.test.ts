import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getAudioContext, playBlip } from '@/src/utils/audio.utils';

import { useMetronomeClicker } from './useMetronomeClicker';

vi.mock('@/src/utils/audio.utils', () => ({
  getAudioContext: vi.fn(),
  playBlip: vi.fn(),
}));

const mockedPlayBlip = vi.mocked(playBlip);
const mockedGetAudioContext = vi.mocked(getAudioContext);

describe('useMetronomeClicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns stable function references across renders', () => {
    const { result, rerender } = renderHook(() => useMetronomeClicker());
    const first = result.current;
    rerender();
    expect(result.current.scheduleClick).toBe(first.scheduleClick);
    expect(result.current.getContext).toBe(first.getContext);
  });

  it('plays an accented downbeat with the higher pitch and gain', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    result.current.scheduleClick(true, 5);
    expect(mockedPlayBlip).toHaveBeenCalledWith({ frequency: 1400, gain: 0.5, when: 5 });
  });

  it('plays an unaccented off-beat with the lower pitch and gain', () => {
    const { result } = renderHook(() => useMetronomeClicker());
    result.current.scheduleClick(false);
    expect(mockedPlayBlip).toHaveBeenCalledWith({ frequency: 900, gain: 0.3, when: undefined });
  });

  it('delegates getContext to the audio utility', () => {
    const fakeContext = { currentTime: 3 } as AudioContext;
    mockedGetAudioContext.mockReturnValue(fakeContext);
    const { result } = renderHook(() => useMetronomeClicker());
    expect(result.current.getContext()).toBe(fakeContext);
  });

  it('does not throw when Web Audio is unavailable', () => {
    mockedGetAudioContext.mockReturnValue(null);
    const { result } = renderHook(() => useMetronomeClicker());
    expect(() => result.current.scheduleClick(true)).not.toThrow();
    expect(result.current.getContext()).toBeNull();
  });
});
