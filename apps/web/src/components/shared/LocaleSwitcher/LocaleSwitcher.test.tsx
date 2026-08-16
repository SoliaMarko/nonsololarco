import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockIntl } from '@/src/test/intl-mock';

import LocaleSwitcher from './LocaleSwitcher';

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

vi.mock('next-intl', () => mockIntl.nextIntl);
vi.mock('@/i18n/navigation', () => mockIntl.navigation);

beforeEach(() => {
  mockIntl.reset();
  mockIntl.setPathname('/repertoire');
  // LocaleSwitcher reads window.location.search lazily in the click handler
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search: '' },
    writable: true,
  });
});

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('LocaleSwitcher', () => {
  it('renders a trigger with the current locale code', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByLabelText('common.locale.switchLanguage')).toBeDefined();
    expect(screen.getByText('EN')).toBeDefined();
  });

  it('shows all locale options when opened', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));

    expect(screen.getByText('English')).toBeDefined();
    expect(screen.getByText('Italiano')).toBeDefined();
    expect(screen.getByText('Українська')).toBeDefined();
  });

  it('displays the group label from translations', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));

    expect(screen.getByText('common.locale.interfaceLanguage')).toBeDefined();
  });

  it('calls router.replace with the selected locale and scroll: false', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));
    await user.click(screen.getByText('Italiano'));

    expect(mockIntl.replace).toHaveBeenCalledWith('/repertoire', {
      locale: 'it',
      scroll: false,
    });
  });

  it('preserves query params across a locale switch', async () => {
    const user = userEvent.setup();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, search: '?status=ready&onlyMine=true' },
      writable: true,
    });
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));
    await user.click(screen.getByText('Italiano'));

    expect(mockIntl.replace).toHaveBeenCalledWith(
      '/repertoire?status=ready&onlyMine=true',
      { locale: 'it', scroll: false },
    );
  });

  it('shows a checkmark on the active locale', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));

    const englishItem = screen.getByText('English').closest('[role="menuitemradio"]');
    expect(englishItem?.textContent).toContain('✓');
  });

  it('does not show a checkmark on inactive locales', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('common.locale.switchLanguage'));

    const italianoItem = screen.getByText('Italiano').closest('[role="menuitemradio"]');
    expect(italianoItem?.textContent).not.toContain('✓');
  });

  it('renders the chevron indicator', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByText('▼')).toBeDefined();
  });

  it('applies className to the trigger', () => {
    render(<LocaleSwitcher className="custom-class" />);

    const trigger = screen.getByLabelText('common.locale.switchLanguage');
    expect(trigger.className).toContain('custom-class');
  });

  it('renders a different locale code when the active locale changes', () => {
    mockIntl.setLocale('uk');
    render(<LocaleSwitcher />);

    expect(screen.getByText('UK')).toBeDefined();
  });
});
