import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

import MetronomeScreen from './MetronomeScreen';

const routerMocks = vi.hoisted(() => ({ back: vi.fn(), push: vi.fn() }));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => routerMocks,
}));

vi.mock('next-intl', () => mockIntl.nextIntl);

// The audio engine is exercised in its own hook tests; here it is stubbed so
// the screen renders without Web Audio.
vi.mock('@/src/hooks/useMetronomeEngine', () => ({
  useMetronomeEngine: () => ({ getBeatPosition: () => null }),
}));

beforeEach(() => {
  // Radix (time-signature dropdown) relies on pointer-capture APIs jsdom omits.
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  mockIntl.reset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('MetronomeScreen', () => {
  it('opens on the song chooser', () => {
    render(<MetronomeScreen />);
    expect(screen.getByText('pages.metronome.chooserTitle')).toBeDefined();
  });

  it('picking a song closes the chooser', async () => {
    render(<MetronomeScreen />);
    await userEvent.click(screen.getByText('Ніч у депо'));
    expect(screen.queryByText('pages.metronome.chooserTitle')).toBeNull();
  });

  it('skipping tracking closes the chooser', async () => {
    render(<MetronomeScreen />);
    await userEvent.click(screen.getByText('pages.metronome.justPlay'));
    expect(screen.queryByText('pages.metronome.chooserTitle')).toBeNull();
  });

  it('adding a new song shows a confirmation toast', async () => {
    render(<MetronomeScreen />);
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Новий трек');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(screen.getByText(/pages\.metronome\.toastAdded/)).toBeDefined();
  });

  it('saving a tracked session shows a saved toast', async () => {
    render(<MetronomeScreen />);
    await userEvent.click(screen.getByText('Ніч у депо'));
    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    await userEvent.click(screen.getByText('pages.metronome.finishAndSave'));
    expect(screen.getByText(/pages\.metronome\.toastSaved/)).toBeDefined();
  });

  it('exiting from an empty history stack routes home', async () => {
    render(<MetronomeScreen />);
    await userEvent.click(screen.getByText('pages.metronome.justPlay'));
    await userEvent.click(screen.getByRole('button', { name: 'Menu and practice history' }));
    await userEvent.click(screen.getByText('pages.metronome.exit'));
    // jsdom starts with a single history entry, so exit pushes home rather
    // than calling router.back().
    expect(routerMocks.push).toHaveBeenCalledWith('/');
  });
});
