import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

import MetronomeTransport from './MetronomeTransport';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

const MOCK_SONG = { bpm: 120, key: 'Am', number: 1, ready: 'ready' as const, title: 'Test Song' };

describe('MetronomeTransport', () => {
  it('shows play button when not playing', () => {
    render(
      <MetronomeTransport onSave={() => {}} onTogglePlay={() => {}} playing={false} tracked={null} />,
    );
    expect(screen.getByRole('button', { name: 'Play' })).toBeDefined();
  });

  it('shows pause button when playing', () => {
    render(
      <MetronomeTransport onSave={() => {}} onTogglePlay={() => {}} playing={true} tracked={null} />,
    );
    expect(screen.getByRole('button', { name: 'Pause' })).toBeDefined();
  });

  it('shows save button when tracking a song and playing', () => {
    render(
      <MetronomeTransport
        onSave={() => {}}
        onTogglePlay={() => {}}
        playing={true}
        tracked={MOCK_SONG}
      />,
    );
    expect(screen.getByText('pages.metronome.finishAndSave')).toBeDefined();
  });

  it('hides save button when not playing', () => {
    render(
      <MetronomeTransport
        onSave={() => {}}
        onTogglePlay={() => {}}
        playing={false}
        tracked={MOCK_SONG}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('hides save button when tracking is skipped', () => {
    render(
      <MetronomeTransport
        onSave={() => {}}
        onTogglePlay={() => {}}
        playing={true}
        tracked="skip"
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('calls onTogglePlay when the play button is clicked', async () => {
    const onTogglePlay = vi.fn();
    render(
      <MetronomeTransport
        onSave={() => {}}
        onTogglePlay={onTogglePlay}
        playing={false}
        tracked={null}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(onTogglePlay).toHaveBeenCalledOnce();
  });

  it('calls onSave when the save button is clicked', async () => {
    const onSave = vi.fn();
    render(
      <MetronomeTransport
        onSave={onSave}
        onTogglePlay={() => {}}
        playing={true}
        tracked={MOCK_SONG}
      />,
    );
    await userEvent.click(screen.getByText('pages.metronome.finishAndSave'));
    expect(onSave).toHaveBeenCalledOnce();
  });
});
