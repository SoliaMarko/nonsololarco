import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LocaleSwitcher from './LocaleSwitcher';

/* ------------------------------------------------------------------ */
/*  Mocks                                                              */
/* ------------------------------------------------------------------ */

const mockReplace = vi.fn();

vi.mock('next-intl', () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'locale.interfaceLanguage': 'Interface language',
    };
    return translations[key] ?? key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/repertoire',
  useRouter: () => ({ replace: mockReplace }),
}));

let mockLocale = 'en';

beforeEach(() => {
  mockLocale = 'en';
  mockReplace.mockClear();
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

    expect(screen.getByText('Interface language')).toBeDefined();
  });

  it('calls router.replace with the selected locale and scroll: false', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));
    await user.click(screen.getByText('Italiano'));

    expect(mockReplace).toHaveBeenCalledWith('/repertoire', {
      locale: 'it',
      scroll: false,
    });
  });

  it('shows a checkmark on the active locale', async () => {
    const user = userEvent.setup();
    render(<LocaleSwitcher />);

    await user.click(screen.getByLabelText('Switch language'));

    // The active locale item (English) should have a checkmark character
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
    mockLocale = 'uk';
    render(<LocaleSwitcher />);

    expect(screen.getByText('UK')).toBeDefined();
  });
});
