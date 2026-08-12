import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MetronomeToast from './MetronomeToast';

describe('MetronomeToast', () => {
  it('renders the message text', () => {
    render(<MetronomeToast message="Entry added" />);
    expect(screen.getByText('Entry added')).toBeDefined();
  });

  it('has a status role for assistive technology', () => {
    render(<MetronomeToast message="Saved" />);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('renders an empty toast when message is empty', () => {
    const { container } = render(<MetronomeToast message="" />);
    const toast = container.querySelector('[role="status"]');
    expect(toast).toBeDefined();
    expect(toast?.textContent).toBe('');
  });
});
