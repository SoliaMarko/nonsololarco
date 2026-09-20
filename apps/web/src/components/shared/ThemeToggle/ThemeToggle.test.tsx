import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import ThemeToggle from './ThemeToggle';

const getButton = () => screen.getByRole('button');

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
  it('offers to switch to light while the theme is dark', () => {
    render(<ThemeToggle />);

    expect(getButton().getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('switches the theme on click and relabels itself', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(getButton());

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(getButton().getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('switches back on a second click', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(getButton());
    await user.click(getButton());

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(getButton().getAttribute('aria-label')).toBe('Switch to light theme');
  });

  it('picks up a theme stored from an earlier visit', () => {
    localStorage.setItem('theme', 'light');

    render(<ThemeToggle />);

    expect(getButton().getAttribute('aria-label')).toBe('Switch to dark theme');
  });

  it('sizes the lamp so it hangs past the header row', () => {
    const { container } = render(<ThemeToggle />);
    const lamp = container.querySelector('span[aria-hidden="true"]') as HTMLElement | null;

    expect(lamp?.style.height).toBe('66px');
  });

  it('accepts a custom lamp height', () => {
    const { container } = render(<ThemeToggle height={240} />);
    const lamp = container.querySelector('span[aria-hidden="true"]') as HTMLElement | null;

    expect(lamp?.style.height).toBe('240px');
  });
});
