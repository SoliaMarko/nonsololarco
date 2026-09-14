import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * The module keeps a process-wide `sharedContext`, so every test resets the
 * module registry and re-imports it to start from a clean slate.
 */
async function loadModule() {
  vi.resetModules();
  return import('./audio.utils');
}

/** Minimal stand-ins for the Web Audio nodes `playBlip` touches. */
function makeFakeContext(state: AudioContextState = 'running') {
  const gainNode = {
    connect: vi.fn(),
    gain: {
      exponentialRampToValueAtTime: vi.fn(),
      setValueAtTime: vi.fn(),
    },
  };
  const oscillator = {
    connect: vi.fn(),
    frequency: { value: 0 },
    start: vi.fn(),
    stop: vi.fn(),
  };
  return {
    createGain: vi.fn(() => gainNode),
    createOscillator: vi.fn(() => oscillator),
    currentTime: 10,
    destination: {},
    gainNode,
    oscillator,
    resume: vi.fn(),
    state,
  };
}

/**
 * Stubs `AudioContext` with a real class whose constructor returns `ctx`.
 * A class is used rather than `vi.fn(() => ctx)` because a plain mock does
 * not reliably adopt an explicit object return when invoked with `new`.
 */
function stubAudioContext(ctx: object) {
  vi.stubGlobal(
    'AudioContext',
    class {
      constructor() {
        return ctx;
      }
    },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getAudioContext', () => {
  it('returns null when AudioContext construction throws', async () => {
    vi.stubGlobal(
      'AudioContext',
      class {
        constructor() {
          throw new Error('no audio');
        }
      },
    );
    const { getAudioContext } = await loadModule();
    expect(getAudioContext()).toBeNull();
  });

  it('creates and caches a single context across calls', async () => {
    const ctx = makeFakeContext();
    let constructed = 0;
    vi.stubGlobal(
      'AudioContext',
      class {
        constructor() {
          constructed += 1;
          return ctx;
        }
      },
    );
    const { getAudioContext } = await loadModule();

    const first = getAudioContext();
    const second = getAudioContext();
    expect(first).toBe(ctx);
    expect(second).toBe(ctx);
    expect(constructed).toBe(1);
  });

  it('resumes a suspended context', async () => {
    const ctx = makeFakeContext('suspended');
    stubAudioContext(ctx);
    const { getAudioContext } = await loadModule();

    getAudioContext();
    expect(ctx.resume).toHaveBeenCalledOnce();
  });
});

describe('playBlip', () => {
  it('is a no-op when Web Audio is unavailable', async () => {
    vi.stubGlobal(
      'AudioContext',
      class {
        constructor() {
          throw new Error('no audio');
        }
      },
    );
    const { playBlip } = await loadModule();
    expect(() => playBlip({ frequency: 440, gain: 0.3 })).not.toThrow();
  });

  it('schedules an oscillator on the audio clock', async () => {
    const ctx = makeFakeContext();
    stubAudioContext(ctx);
    const { playBlip } = await loadModule();

    playBlip({ duration: 0.05, frequency: 880, gain: 0.4 });

    expect(ctx.oscillator.frequency.value).toBe(880);
    expect(ctx.gainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.4, 10);
    expect(ctx.oscillator.start).toHaveBeenCalledWith(10);
    expect(ctx.oscillator.stop).toHaveBeenCalledWith(10.05);
  });

  it('honours an explicit start time', async () => {
    const ctx = makeFakeContext();
    stubAudioContext(ctx);
    const { playBlip } = await loadModule();

    playBlip({ duration: 0.02, frequency: 2200, gain: 0.06, when: 42 });

    expect(ctx.oscillator.start).toHaveBeenCalledWith(42);
    expect(ctx.oscillator.stop).toHaveBeenCalledWith(42.02);
  });
});
