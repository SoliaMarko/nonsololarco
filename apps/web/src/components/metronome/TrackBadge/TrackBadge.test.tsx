import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

import TrackBadge from './TrackBadge';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

const MOCK_SONG = { bpm: 120, key: 'Am', number: 1, ready: 'ready' as const, title: 'Test Song' };

describe('TrackBadge', () => {
  it('shows song name when tracking a song', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked={MOCK_SONG} />);
    expect(screen.getByText('pages.metronome.trackingIn')).toBeDefined();
    expect(screen.getByText('pages.metronome.change')).toBeDefined();
  });

  it('shows untracked state when skipping', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked="skip" />);
    expect(screen.getByText('pages.metronome.noTracking')).toBeDefined();
    expect(screen.getByText('pages.metronome.chooseTrack')).toBeDefined();
  });

  it('shows untracked state when tracked is null', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked={null} />);
    expect(screen.getByText('pages.metronome.noTracking')).toBeDefined();
  });

  it('calls onChangeTrack when change button is clicked', async () => {
    const onChangeTrack = vi.fn();
    render(<TrackBadge onChangeTrack={onChangeTrack} tracked={MOCK_SONG} />);
    await userEvent.click(screen.getByText('pages.metronome.change'));
    expect(onChangeTrack).toHaveBeenCalledOnce();
  });

  it('calls onChangeTrack when choose-song button is clicked', async () => {
    const onChangeTrack = vi.fn();
    render(<TrackBadge onChangeTrack={onChangeTrack} tracked="skip" />);
    await userEvent.click(screen.getByText('pages.metronome.chooseTrack'));
    expect(onChangeTrack).toHaveBeenCalledOnce();
  });
});
