import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeSession } from '@/src/lib/types/metronome.types';

import { mockIntl } from '@/src/test/intl-mock';

import HistoryDrawer from './HistoryDrawer';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

function mkSession(over: Partial<PracticeSession> & { id: string }): PracticeSession {
  return {
    bpm: 90,
    durationMs: 10 * 60000,
    song: 'Song',
    songNumber: 1,
    startedAt: '2026-06-01T10:00:00.000Z',
    ...over,
  };
}

const HISTORY: PracticeSession[] = [
  mkSession({ id: 'a', song: 'Night Depot', songNumber: 1, durationMs: 10 * 60000 }),
  mkSession({ id: 'b', song: 'Night Depot', songNumber: 1, durationMs: 20 * 60000 }),
  mkSession({ id: 'c', song: 'Trolleybus', songNumber: 2, durationMs: 15 * 60000 }),
];

function setup(history = HISTORY) {
  const onClose = vi.fn();
  const onDelete = vi.fn();
  const onExit = vi.fn();
  const utils = render(
    <HistoryDrawer history={history} onClose={onClose} onDelete={onDelete} onExit={onExit} />,
  );
  return { ...utils, onClose, onDelete, onExit };
}

describe('HistoryDrawer', () => {
  it('renders a group per distinct song', () => {
    setup();
    expect(screen.getByText('Night Depot')).toBeDefined();
    expect(screen.getByText('Trolleybus')).toBeDefined();
  });

  it('shows aggregate stats: works, sessions and total minutes', () => {
    setup();
    // 2 works, 3 sessions, 10 + 20 + 15 = 45 minutes.
    expect(screen.getByText('45')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    // Two groups → the "works" stat reads 2.
    const works = screen.getByText('pages.metronome.statTracks').parentElement as HTMLElement;
    expect(within(works).getByText('2')).toBeDefined();
  });

  it('renders the empty state when there is no history', () => {
    setup([]);
    expect(screen.getByText('pages.metronome.emptyTitle')).toBeDefined();
  });

  it('calls onClose when the scrim is clicked', async () => {
    const { onClose, container } = setup();
    const scrim = container.querySelector('.z-35') as HTMLElement;
    await userEvent.click(scrim);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onExit from the footer action', async () => {
    const { onExit } = setup();
    await userEvent.click(screen.getByText('pages.metronome.exit'));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('deletes an entry then restores it via undo', async () => {
    const { onDelete } = setup();
    // Expand the first group to reveal its session rows.
    await userEvent.click(screen.getByText('Trolleybus'));
    await userEvent.click(screen.getByRole('button', { name: 'pages.metronome.ariaDeleteEntry' }));
    expect(onDelete).toHaveBeenCalledWith('c');

    // Undo bar appears; clicking it restores the entry.
    expect(screen.getByText(/pages\.metronome\.entryDeleted/)).toBeDefined();
    await userEvent.click(screen.getByText('pages.metronome.undo'));
    expect(onDelete).toHaveBeenLastCalledWith('', expect.objectContaining({ id: 'c' }));
  });
});
