import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMetronomeEngine } from './useMetronomeEngine';

describe('useMetronomeEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not throw when idle (not playing)', () => {
    expect(() =>
      renderHook(() =>
        useMetronomeEngine({ beats: 4, bpm: 120, onBeat: vi.fn(), playing: false }),
      ),
    ).not.toThrow();
  });

  it('does not call onBeat while not playing', () => {
    const onBeat = vi.fn();
    renderHook(() => useMetronomeEngine({ beats: 4, bpm: 120, onBeat, playing: false }));
    vi.advanceTimersByTime(1000);
    expect(onBeat).not.toHaveBeenCalled();
  });

  it('cleans up timers on unmount without throwing', () => {
    const { unmount } = renderHook(() =>
      useMetronomeEngine({ beats: 4, bpm: 120, onBeat: vi.fn(), playing: true }),
    );
    expect(() => unmount()).not.toThrow();
  });
});
