import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LocaleStamp from './LocaleStamp';

describe('LocaleStamp', () => {
  it('renders the locale code in uppercase', () => {
    render(<LocaleStamp locale="uk" />);

    expect(screen.getByText('UK')).toBeDefined();
  });

  it('is aria-hidden since it is decorative', () => {
    const { container } = render(<LocaleStamp locale="en" />);

    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the flag triangle with the correct gradient', () => {
    const { container } = render(<LocaleStamp locale="it" />);

    const triangle = container.querySelectorAll('[aria-hidden="true"]')[1] as HTMLElement;
    expect(triangle.style.background).toContain('#008c45');
  });

  it('renders all three locales without error', () => {
    const { unmount: u1 } = render(<LocaleStamp locale="en" />);
    expect(screen.getByText('EN')).toBeDefined();
    u1();

    const { unmount: u2 } = render(<LocaleStamp locale="it" />);
    expect(screen.getByText('IT')).toBeDefined();
    u2();

    render(<LocaleStamp locale="uk" />);
    expect(screen.getByText('UK')).toBeDefined();
  });

  it('applies className to the outer element', () => {
    const { container } = render(<LocaleStamp locale="en" className="custom-stamp" />);

    expect(container.firstElementChild?.className).toContain('custom-stamp');
  });

  it('has a fixed width so all stamps align in a column', () => {
    const { container } = render(<LocaleStamp locale="en" />);

    expect(container.firstElementChild?.className).toContain('w-9');
  });
});
