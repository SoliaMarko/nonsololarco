import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChooserSong } from '@/src/lib/types/metronome.types';

import { mockIntl } from '@/src/test/intl-mock';

import SongChooser from './SongChooser';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

const SONGS: ChooserSong[] = [
  { bpm: 92, key: 'Am', number: 1, ready: 'learning', title: 'Ніч у депо' },
  { bpm: 120, key: 'G', number: 2, ready: 'ready', title: 'Тролейбус №7' },
];

function setup(overrides: Partial<React.ComponentProps<typeof SongChooser>> = {}) {
  const onAdd = vi.fn();
  const onBack = vi.fn();
  const onPick = vi.fn();
  const onSkip = vi.fn();
  const utils = render(
    <SongChooser
      onAdd={onAdd}
      onBack={onBack}
      onPick={onPick}
      onSkip={onSkip}
      songs={SONGS}
      {...overrides}
    />,
  );
  return { ...utils, onAdd, onBack, onPick, onSkip };
}

describe('SongChooser', () => {
  it('renders the heading and songs', () => {
    setup();
    expect(screen.getByText('pages.metronome.chooserTitle')).toBeDefined();
    expect(screen.getByText('Ніч у депо')).toBeDefined();
    expect(screen.getByText('Тролейбус №7')).toBeDefined();
  });

  it('calls onPick when a song is clicked', async () => {
    const { onPick } = setup();
    await userEvent.click(screen.getByText('Ніч у депо'));
    expect(onPick).toHaveBeenCalledWith(SONGS[0]);
  });

  it('calls onSkip when the skip action is clicked', async () => {
    const { onSkip } = setup();
    await userEvent.click(screen.getByText('pages.metronome.justPlay'));
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('filters songs by search query', async () => {
    setup();
    const input = screen.getByPlaceholderText('pages.metronome.searchPlaceholder');
    await userEvent.type(input, 'Трол');
    expect(screen.queryByText('Ніч у депо')).toBeNull();
    expect(screen.getByText('Тролейбус №7')).toBeDefined();
  });

  it('shows inline form when the add action is clicked', async () => {
    setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    expect(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder')).toBeDefined();
    expect(screen.getByPlaceholderText('BPM')).toBeDefined();
  });

  it('calls onAdd with title and BPM when form is submitted', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Новий трек');
    await userEvent.type(screen.getByPlaceholderText('BPM'), '140');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(onAdd).toHaveBeenCalledWith('Новий трек', 140, { beats: 4, label: '4/4' });
  });

  it('calls onAdd with title and no BPM when BPM is empty', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Без BPM');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(onAdd).toHaveBeenCalledWith('Без BPM', undefined, { beats: 4, label: '4/4' });
  });

  it('rejects a negative BPM and does not call onAdd', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Мінусовий');
    await userEvent.type(screen.getByPlaceholderText('BPM'), '-5');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('rejects a zero BPM and does not call onAdd', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Нуль');
    await userEvent.type(screen.getByPlaceholderText('BPM'), '0');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeDefined();
  });

  it('clears the BPM error once the field is edited again', async () => {
    const { onAdd } = setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Виправлення');
    await userEvent.type(screen.getByPlaceholderText('BPM'), '0');
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(screen.getByRole('alert')).toBeDefined();

    await userEvent.clear(screen.getByPlaceholderText('BPM'));
    await userEvent.type(screen.getByPlaceholderText('BPM'), '150');
    expect(screen.queryByRole('alert')).toBeNull();
    await userEvent.click(screen.getByText('pages.metronome.addAndPlay'));
    expect(onAdd).toHaveBeenCalledWith('Виправлення', 150, { beats: 4, label: '4/4' });
  });

  it('disables submit button when title is empty', async () => {
    setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    const submitBtn = screen.getByText('pages.metronome.addAndPlay');
    expect(submitBtn.getAttribute('disabled')).toBe('');
  });

  it('calls onBack when the back button is clicked', async () => {
    const { onBack } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Exit metronome' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('does not also dismiss when the back button is clicked', async () => {
    const onDismiss = vi.fn();
    const { onBack } = setup({ onDismiss });
    await userEvent.click(screen.getByRole('button', { name: 'Exit metronome' }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss when the backdrop is clicked', async () => {
    const onDismiss = vi.fn();
    setup({ onDismiss });
    await userEvent.click(screen.getByText('pages.metronome.beforeStart'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not call onDismiss when the card is clicked', async () => {
    const onDismiss = vi.fn();
    setup({ onDismiss });
    await userEvent.click(screen.getByPlaceholderText('pages.metronome.searchPlaceholder'));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss on Escape', async () => {
    const onDismiss = vi.fn();
    setup({ onDismiss });
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('Escape cancels the inline form instead of dismissing', async () => {
    const onDismiss = vi.fn();
    setup({ onDismiss });
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.keyboard('{Escape}');
    expect(onDismiss).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('pages.metronome.newTitlePlaceholder')).toBeNull();
  });

  it('stays open on backdrop click when onDismiss is omitted', async () => {
    setup();
    await userEvent.click(screen.getByText('pages.metronome.beforeStart'));
    expect(screen.getByText('pages.metronome.chooserTitle')).toBeDefined();
  });

  it('hides the form when the cancel action is clicked', async () => {
    setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    expect(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder')).toBeDefined();
    await userEvent.click(screen.getByText('pages.metronome.cancel'));
    expect(screen.queryByPlaceholderText('pages.metronome.newTitlePlaceholder')).toBeNull();
    expect(screen.getByText('pages.metronome.newTrack')).toBeDefined();
  });

  it('discards the draft when the form is cancelled and reopened', async () => {
    setup();
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Чернетка');
    await userEvent.type(screen.getByPlaceholderText('BPM'), '175');
    await userEvent.click(screen.getByText('pages.metronome.cancel'));

    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    expect((screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder') as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText('BPM') as HTMLInputElement).value).toBe('');
  });

  it('discards the draft when Escape cancels the form and it is reopened', async () => {
    setup({ onDismiss: vi.fn() });
    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    await userEvent.type(screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder'), 'Чернетка');
    await userEvent.keyboard('{Escape}');

    await userEvent.click(screen.getByText('pages.metronome.newTrack'));
    expect((screen.getByPlaceholderText('pages.metronome.newTitlePlaceholder') as HTMLInputElement).value).toBe('');
  });
});
