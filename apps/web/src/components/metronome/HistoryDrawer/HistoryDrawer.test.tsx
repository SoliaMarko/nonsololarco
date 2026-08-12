import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PracticeSession } from '@/src/lib/types/metronome.types';

import HistoryDrawer from './HistoryDrawer';

function mkSession(over: Partial<PracticeSession> & { id: string }): PracticeSession {
  return {
    bpm: 90,
    duration: '10 хв',
    durationMs: 10 * 60000,
    song: 'Пісня',
    songNumber: 1,
    startedAt: '2026-06-01T10:00:00.000Z',
    ...over,
  };
}

const HISTORY: PracticeSession[] = [
  mkSession({ id: 'a', song: 'Ніч у депо', songNumber: 1, durationMs: 10 * 60000, duration: '10 хв' }),
  mkSession({ id: 'b', song: 'Ніч у депо', songNumber: 1, durationMs: 20 * 60000, duration: '20 хв' }),
  mkSession({ id: 'c', song: 'Тролейбус', songNumber: 2, durationMs: 15 * 60000, duration: '15 хв' }),
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
    expect(screen.getByText('Ніч у депо')).toBeDefined();
    expect(screen.getByText('Тролейбус')).toBeDefined();
  });

  it('shows aggregate stats: works, sessions and total minutes', () => {
    setup();
    // 2 works, 3 sessions, 10 + 20 + 15 = 45 minutes.
    expect(screen.getByText('45')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    // Two groups → the "works" stat reads 2.
    const works = screen.getByText('ТВОРІВ').parentElement as HTMLElement;
    expect(within(works).getByText('2')).toBeDefined();
  });

  it('renders the empty state when there is no history', () => {
    setup([]);
    expect(screen.getByText('Поки порожньо')).toBeDefined();
  });

  it('calls onClose when the scrim is clicked', async () => {
    const { onClose, container } = setup();
    const scrim = container.querySelector('.z-35') as HTMLElement;
    await userEvent.click(scrim);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onExit from the footer action', async () => {
    const { onExit } = setup();
    await userEvent.click(screen.getByText('Вийти з метронома'));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('deletes an entry then restores it via undo', async () => {
    const { onDelete } = setup();
    // Expand the first group to reveal its session rows.
    await userEvent.click(screen.getByText('Тролейбус'));
    await userEvent.click(screen.getByRole('button', { name: 'Delete entry' }));
    expect(onDelete).toHaveBeenCalledWith('c');

    // Undo bar appears; clicking it restores the entry.
    expect(screen.getByText(/Запис видалено/)).toBeDefined();
    await userEvent.click(screen.getByText('Повернути'));
    expect(onDelete).toHaveBeenLastCalledWith('', expect.objectContaining({ id: 'c' }));
  });
});
