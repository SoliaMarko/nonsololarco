import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import MetronomeTopBar from './MetronomeTopBar';

describe('MetronomeTopBar', () => {
  const defaultProps = {
    onBack: vi.fn(),
    onMenuOpen: vi.fn(),
    onSignatureChange: vi.fn(),
    signature: 4 as const,
  };

  it('renders the title "МЕТРОНОМ"', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByText('МЕТРОНОМ')).toBeDefined();
  });

  it('renders all three time signature buttons', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByText('4/4')).toBeDefined();
    expect(screen.getByText('3/4')).toBeDefined();
    expect(screen.getByText('6/4')).toBeDefined();
  });

  it('renders the back button', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByText('Назад')).toBeDefined();
  });

  it('renders the history button', () => {
    render(<MetronomeTopBar {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Історія практик' })).toBeDefined();
  });

  it('calls onSignatureChange when a time sig button is clicked', async () => {
    const onSignatureChange = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onSignatureChange={onSignatureChange} />);
    await userEvent.click(screen.getByText('3/4'));
    expect(onSignatureChange).toHaveBeenCalledWith(3);
  });

  it('calls onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onBack={onBack} />);
    await userEvent.click(screen.getByText('Назад'));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('calls onMenuOpen when burger button is clicked', async () => {
    const onMenuOpen = vi.fn();
    render(<MetronomeTopBar {...defaultProps} onMenuOpen={onMenuOpen} />);
    await userEvent.click(screen.getByRole('button', { name: 'Історія практик' }));
    expect(onMenuOpen).toHaveBeenCalledOnce();
  });
});
