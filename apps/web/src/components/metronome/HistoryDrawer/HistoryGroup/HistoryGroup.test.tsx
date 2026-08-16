import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeSession } from '@/src/lib/types/metronome.types';

import { mockIntl } from '@/src/test/intl-mock';

import HistoryGroup from './HistoryGroup';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

const SESSION_A: PracticeSession = {
  bpm: 100,
  durationMs: 180000,
  id: 'a',
  song: 'Night at the Depot',
  songNumber: 1,
  startedAt: '2025-06-10T10:00:00Z',
};

const SESSION_B: PracticeSession = {
  bpm: 120,
  durationMs: 20000,
  id: 'b',
  song: 'Night at the Depot',
  songNumber: 1,
  startedAt: '2025-06-11T14:00:00Z',
};

const GROUP = {
  rows: [SESSION_A, SESSION_B],
  song: 'Night at the Depot',
  songNumber: 1,
};

describe('HistoryGroup', () => {
  it('renders the song name and session count', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={false} />);
    expect(screen.getByText('Night at the Depot')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('shows the group summary with best BPM and count', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={false} />);
    // The mock returns the key with ICU params stringified
    expect(screen.getByText(/pages\.metronome\.groupSummary/)).toBeDefined();
  });

  it('does not show session rows when collapsed', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={false} />);
    expect(screen.queryByText('100')).toBeNull();
  });

  it('shows session rows when expanded', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={true} />);
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('120')).toBeDefined();
  });

  it('displays duration for sessions over a minute', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={true} />);
    // SESSION_A is 180000ms = 3 minutes
    expect(screen.getByText(/pages\.metronome\.durationMin/)).toBeDefined();
  });

  it('displays under-a-minute label for short sessions', () => {
    const shortSession: PracticeSession = {
      bpm: 80,
      durationMs: 25000,
      id: 'short',
      song: 'Short Song',
      songNumber: 2,
      startedAt: '2025-06-12T09:00:00Z',
    };
    const shortGroup = { rows: [shortSession], song: 'Short Song', songNumber: 2 };
    render(<HistoryGroup group={shortGroup} onDelete={vi.fn()} onToggle={vi.fn()} open={true} />);
    expect(screen.getByText('pages.metronome.durationUnderMin')).toBeDefined();
  });

  it('calls onToggle when the header is clicked', async () => {
    const onToggle = vi.fn();
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={onToggle} open={false} />);
    await userEvent.click(screen.getByText('Night at the Depot'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('calls onDelete with the session when the delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<HistoryGroup group={GROUP} onDelete={onDelete} onToggle={vi.fn()} open={true} />);
    const deleteButtons = screen.getAllByRole('button', { name: 'pages.metronome.ariaDeleteEntry' });
    await userEvent.click(deleteButtons[0]!);
    expect(onDelete).toHaveBeenCalledWith(SESSION_A);
  });

  it('renders a delete button for each session row', () => {
    render(<HistoryGroup group={GROUP} onDelete={vi.fn()} onToggle={vi.fn()} open={true} />);
    const deleteButtons = screen.getAllByRole('button', { name: 'pages.metronome.ariaDeleteEntry' });
    expect(deleteButtons).toHaveLength(2);
  });
});
