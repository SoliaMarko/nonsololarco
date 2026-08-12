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
});

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe('LocaleSwitcher', () => {
  it('renders a trigger with the current locale code', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByLabelText('Switch language')).toBeDefined();
    expect(screen.getByText('EN')).toBeDefined();
  });

  it('shows all locale options when opened', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));

    expect(screen.getByText('English')).toBeDefined();
    expect(screen.getByText('Italiano')).toBeDefined();
    expect(screen.getByText('Українська')).toBeDefined();
  });

  it('displays the group label from translations', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));

    expect(screen.getByText('common.locale.interfaceLanguage')).toBeDefined();
  });

  it('calls router.replace with the selected locale and scroll: false', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));
    await user.click(screen.getByText('Italiano'));

    expect(mockIntl.replace).toHaveBeenCalledWith('/repertoire', {
      locale: 'it',
      scroll: false,
    });
  });

  it('shows a checkmark on the active locale', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));

    const englishItem = screen.getByText('English').closest('[role="menuitem"]');
    expect(englishItem?.textContent).toContain('✓');
  });

  it('does not show a checkmark on inactive locales', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));

    const italianoItem = screen.getByText('Italiano').closest('[role="menuitem"]');
    expect(italianoItem?.textContent).not.toContain('✓');
  });

  it('renders the chevron indicator', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByText('▼')).toBeDefined();
  });

  it('applies className to the trigger', () => {
    render(<LocaleSwitcher className="custom-class" />);

    const trigger = screen.getByLabelText('Switch language');
    expect(trigger.className).toContain('custom-class');
  });

  it('renders a different locale code when the active locale changes', () => {
    mockIntl.setLocale('uk');
    render(<LocaleSwitcher />);

    expect(screen.getByText('UK')).toBeDefined();
  });
});
