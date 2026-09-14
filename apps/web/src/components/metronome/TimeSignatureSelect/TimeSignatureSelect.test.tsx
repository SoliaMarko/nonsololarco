import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

import TimeSignatureSelect from './TimeSignatureSelect';

vi.mock('next-intl', () => mockIntl.nextIntl);

beforeEach(() => {
  mockIntl.reset();
});

describe('TimeSignatureSelect', () => {
  const defaults = {
    denominator: 4,
    numerator: 4,
    onChange: vi.fn(),
    variant: 'dark' as const,
  };

  it('renders a trigger for each half of the signature', () => {
    render(<TimeSignatureSelect {...defaults} />);
    expect(screen.getByLabelText('pages.metronome.ariaTimeSigNumerator')).toBeDefined();
    expect(screen.getByLabelText('pages.metronome.ariaTimeSigDenominator')).toBeDefined();
  });

  it('shows the current values on the triggers', () => {
    render(<TimeSignatureSelect {...defaults} denominator={8} numerator={6} />);
    expect(screen.getByLabelText('pages.metronome.ariaTimeSigNumerator').textContent).toContain(
      '6',
    );
    expect(screen.getByLabelText('pages.metronome.ariaTimeSigDenominator').textContent).toContain(
      '8',
    );
  });

  it('renders the slash separator', () => {
    render(<TimeSignatureSelect {...defaults} />);
    expect(screen.getByText('/')).toBeDefined();
  });

  it('hides the captions by default', () => {
    render(<TimeSignatureSelect {...defaults} />);
    expect(screen.queryByText('pages.metronome.beatsLabel')).toBeNull();
    expect(screen.queryByText('pages.metronome.noteLabel')).toBeNull();
  });

  it('shows the captions when asked', () => {
    render(<TimeSignatureSelect {...defaults} showLabels />);
    expect(screen.getByText('pages.metronome.beatsLabel')).toBeDefined();
    expect(screen.getByText('pages.metronome.noteLabel')).toBeDefined();
  });

  it('offers only the numerators valid for the current denominator', async () => {
    render(<TimeSignatureSelect {...defaults} denominator={8} numerator={6} />);
    await userEvent.click(screen.getByLabelText('pages.metronome.ariaTimeSigNumerator'));

    const labels = screen.getAllByRole('menuitem').map((i) => i.textContent);
    // /8 admits 3, 5, 6, 7, 9, 12 — never 4
    expect(labels).toContain('3');
    expect(labels).not.toContain('4');
  });

  it('reports the picked numerator with the unchanged denominator', async () => {
    const onChange = vi.fn();
    render(<TimeSignatureSelect {...defaults} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('pages.metronome.ariaTimeSigNumerator'));
    await userEvent.click(screen.getByRole('menuitem', { name: '3' }));
    expect(onChange).toHaveBeenCalledWith(3, 4);
  });

  it('auto-corrects the numerator when the new denominator forbids it', async () => {
    const onChange = vi.fn();
    render(<TimeSignatureSelect {...defaults} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('pages.metronome.ariaTimeSigDenominator'));
    // 4 is invalid for /8, so it falls back to the first valid numerator
    await userEvent.click(screen.getByRole('menuitem', { name: '8' }));
    expect(onChange).toHaveBeenCalledWith(3, 8);
  });

  it('keeps the numerator when the new denominator still allows it', async () => {
    const onChange = vi.fn();
    render(<TimeSignatureSelect {...defaults} numerator={3} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('pages.metronome.ariaTimeSigDenominator'));
    await userEvent.click(screen.getByRole('menuitem', { name: '8' }));
    expect(onChange).toHaveBeenCalledWith(3, 8);
  });
});
