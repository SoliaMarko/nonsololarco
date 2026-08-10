import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TrackBadge from './TrackBadge';

const MOCK_SONG = { bpm: 120, key: 'Am', number: 1, ready: 'ready' as const, title: 'Test Song' };

describe('TrackBadge', () => {
  it('shows song name when tracking a song', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked={MOCK_SONG} />);
    expect(screen.getByText('Test Song')).toBeDefined();
    expect(screen.getByText('змінити')).toBeDefined();
  });

  it('shows "Без трекінгу" when skipping', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked="skip" />);
    expect(screen.getByText('Без трекінгу')).toBeDefined();
    expect(screen.getByText('обрати твір')).toBeDefined();
  });

  it('shows "Без трекінгу" when tracked is null', () => {
    render(<TrackBadge onChangeTrack={() => {}} tracked={null} />);
    expect(screen.getByText('Без трекінгу')).toBeDefined();
  });

  it('calls onChangeTrack when "змінити" is clicked', async () => {
    const onChangeTrack = vi.fn();
    render(<TrackBadge onChangeTrack={onChangeTrack} tracked={MOCK_SONG} />);
    await userEvent.click(screen.getByText('змінити'));
    expect(onChangeTrack).toHaveBeenCalledOnce();
  });

  it('calls onChangeTrack when "обрати твір" is clicked', async () => {
    const onChangeTrack = vi.fn();
    render(<TrackBadge onChangeTrack={onChangeTrack} tracked="skip" />);
    await userEvent.click(screen.getByText('обрати твір'));
    expect(onChangeTrack).toHaveBeenCalledOnce();
  });
});
