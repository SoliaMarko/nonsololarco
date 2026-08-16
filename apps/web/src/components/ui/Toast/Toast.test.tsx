import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Toast from './Toast';

describe('Toast', () => {
  it('renders the message text', () => {
    render(<Toast message="Entry added" />);
    expect(screen.getByText('Entry added')).toBeDefined();
  });

  it('has a status role for assistive technology', () => {
    render(<Toast message="Saved" />);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('has aria-live polite', () => {
    render(<Toast message="Saved" />);
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  });

  it('renders an empty toast when message is empty', () => {
    const { container } = render(<Toast message="" />);
    const toast = container.querySelector('[role="status"]');
    expect(toast).toBeDefined();
    expect(toast?.textContent).toBe('');
  });

  it('renders a default icon for success variant', () => {
    const { container } = render(<Toast message="Done" variant="success" />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('renders a default icon for error variant', () => {
    const { container } = render(<Toast message="Failed" variant="error" />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('renders a default icon for info variant', () => {
    const { container } = render(<Toast message="Note" variant="info" />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('suppresses the icon when icon={null}', () => {
    const { container } = render(<Toast message="No icon" icon={null} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders a custom icon when provided', () => {
    function StarIcon(props: Record<string, unknown>) {
      return <svg data-custom-icon {...props} />;
    }
    const { container } = render(<Toast message="Star" icon={StarIcon} />);
    expect(container.querySelector('[data-custom-icon]')).toBeDefined();
  });

  it('merges an external className', () => {
    render(<Toast message="Pos" className="absolute bottom-4" />);
    const el = screen.getByRole('status');
    expect(el.className).toContain('absolute');
    expect(el.className).toContain('bottom-4');
  });
});
