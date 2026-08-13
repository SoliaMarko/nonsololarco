import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TimeSignatureDef } from '@/src/lib/types/metronome.types';

import MetronomeTopBar from './MetronomeTopBar';

const sig44: TimeSignatureDef = { beats: 4, label: '4/4' };

describe('MetronomeTopBar', () => {
  const defaultProps = {
    onMenuOpen: vi.fn(),
    onSignatureChange: vi.fn(),
    signature: sig44,
  };

  it('renders the title', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByText('МЕТРОНОМ')).toBeDefined();
  });

  it('renders numerator and denominator dropdowns', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByLabelText('Time signature numerator')).toBeDefined();
    expect(screen.getByLabelText('Time signature denominator')).toBeDefined();
  });

  it('calls onSignatureChange when numerator is picked', async () => {
    const onSignatureChange = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onSignatureChange={onSignatureChange} />);
    await userEvent.click(screen.getByLabelText('Time signature numerator'));
    await userEvent.click(screen.getByRole('menuitem', { name: '3' }));
    expect(onSignatureChange).toHaveBeenCalledWith({ beats: 3, label: '3/4' });
  });

  it('auto-corrects numerator when denominator invalidates it', async () => {
    const onSignatureChange = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onSignatureChange={onSignatureChange} />);
    await userEvent.click(screen.getByLabelText('Time signature denominator'));
    // /8 valid numerators: 3,5,6,7,9,12 — 4 invalid, corrects to 3
    await userEvent.click(screen.getByRole('menuitem', { name: '8' }));
    expect(onSignatureChange).toHaveBeenCalledWith({ beats: 3, label: '3/8' });
  });

  it('calls onMenuOpen when burger button is clicked', async () => {
    const onMenuOpen = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onMenuOpen={onMenuOpen} />);
    await userEvent.click(screen.getByRole('button', { name: 'Menu and practice history' }));
    expect(onMenuOpen).toHaveBeenCalledOnce();
  });
});
