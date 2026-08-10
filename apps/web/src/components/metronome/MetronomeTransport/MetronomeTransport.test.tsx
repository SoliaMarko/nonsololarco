import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetronomeTransport from './MetronomeTransport';

const MOCK_SONG = { bpm: 120, key: 'Am', number: 1, ready: 'ready' as const, title: 'Test Song' };

describe('MetronomeTransport', () => {
  it('shows play button when not playing', () => {
    render(
      <MetronomeTransport onSave={() => {}} onTogglePlay={() => {}} playing={false} tracked={null} />,
    );
    expect(screen.getByRole('button', { name: 'Старт' })).toBeDefined();
  });

  it('shows pause button when playing', () => {
    render(
      <MetronomeTransport onSave={() => {}} onTogglePlay={() => {}} playing={true} tracked={null} />,
    );
    expect(screen.getByRole('button', { name: 'Пауза' })).toBeDefined();
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
    expect(screen.getByText('Завершити та зберегти')).toBeDefined();
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
});
