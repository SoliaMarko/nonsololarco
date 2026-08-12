import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMetronomeClicker } from '@/src/hooks/useMetronomeClicker';

import { useMetronomeEngine } from './useMetronomeEngine';

vi.mock('@/src/hooks/useMetronomeClicker', () => ({
  useMetronomeClicker: vi.fn(),
}));

const mockedUseClicker = vi.mocked(useMetronomeClicker);

/** A fake audio clock whose `currentTime` the test drives by hand. */
function makeClock() {
  const ctx = { currentTime: 0 };
  const scheduleClick = vi.fn();
  const getContext = vi.fn(() => ctx as unknown as AudioContext);
  mockedUseClicker.mockReturnValue({ getContext, scheduleClick });
  return { ctx, getContext, scheduleClick };
}

/** Captured `requestAnimationFrame` callback, invoked manually per frame. */
let rafCallback: FrameRequestCallback | null = null;

beforeEach(() => {
  vi.useFakeTimers();
  rafCallback = null;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    rafCallback = cb;
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useMetronomeEngine', () => {
  it('does not call onBeat or schedule clicks while stopped', () => {
    const { scheduleClick } = makeClock();
    const onBeat = vi.fn();
    renderHook(() => useMetronomeEngine({ beats: 4, bpm: 120, onBeat, playing: false }));
    vi.advanceTimersByTime(1000);
    expect(scheduleClick).not.toHaveBeenCalled();
    expect(onBeat).not.toHaveBeenCalled();
  });

  it('schedules an accented downbeat when playback starts', () => {
    const { scheduleClick } = makeClock();
    renderHook(() => useMetronomeEngine({ beats: 4, bpm: 120, onBeat: vi.fn(), playing: true }));
    // The initial scheduler pass queues the first note at currentTime + 0.05.
    expect(scheduleClick).toHaveBeenCalledWith(true, 0.05);
  });

  it('delivers the beat index to onBeat once the note becomes audible', () => {
    const { ctx } = makeClock();
    const onBeat = vi.fn();
    renderHook(() => useMetronomeEngine({ beats: 4, bpm: 120, onBeat, playing: true }));

    // Advance the audio clock past the first scheduled note and run one frame.
    ctx.currentTime = 0.05;
    rafCallback?.(0);
    expect(onBeat).toHaveBeenCalledWith(0);
  });

  it('stops scheduling after unmount', () => {
    const { ctx, scheduleClick } = makeClock();
    const { unmount } = renderHook(() =>
      useMetronomeEngine({ beats: 4, bpm: 120, onBeat: vi.fn(), playing: true }),
    );
    scheduleClick.mockClear();

    unmount();
    ctx.currentTime = 5;
    vi.advanceTimersByTime(1000);
    expect(scheduleClick).not.toHaveBeenCalled();
  });
});
