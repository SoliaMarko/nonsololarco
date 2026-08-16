/**
 * Centralized next-intl mock for unit tests.
 *
 * Provides stub implementations of `useTranslations`, `useLocale`,
 * `useFormatter` and the `@/i18n/navigation` helpers. Locale defaults
 * to `'en'` and can be changed per-test via `setMockLocale()`.
 *
 * Usage — call `vi.mock` at the top of your test file:
 *
 * @example
 * ```ts
 * import { mockIntl } from '@/src/test/intl-mock';
 *
 * vi.mock('next-intl', () => mockIntl.nextIntl);
 * vi.mock('@/i18n/navigation', () => mockIntl.navigation);
 * ```
 *
 * Then in `beforeEach`:
 * ```ts
 * beforeEach(() => {
 *   mockIntl.reset();
 * });
 * ```
 */
import { type Mock, vi } from 'vitest';

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

let locale = 'en';
let pathname = '/';

const replace: Mock = vi.fn();
const push: Mock = vi.fn();

/* ------------------------------------------------------------------ */
/*  Stub: useTranslations                                              */
/* ------------------------------------------------------------------ */

/**
 * Returns the translation key as-is (with optional ICU params appended).
 * Tests assert against keys rather than English strings, keeping them
 * locale-independent.
 */
function stubUseTranslations(namespace?: string) {
  const translate = (key: string, params?: Record<string, unknown>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    if (params) return `${fullKey} ${JSON.stringify(params)}`;
    return fullKey;
  };

  // next-intl's `t.rich` renders embedded markup tags; unit tests only need a
  // stable string, so collapse it to the key and drop the rich formatting.
  translate.rich = (key: string) => (namespace ? `${namespace}.${key}` : key);

  return translate;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const mockIntl = {
  /** Module mock for `next-intl`. */
  nextIntl: {
    useLocale: () => locale,
    useTranslations: stubUseTranslations,
    useFormatter: () => ({
      dateTime: (d: Date) => d.toISOString(),
      number: (n: number) => String(n),
      relativeTime: (v: number) => `${v}`,
    }),
  },

  /**
   * Module mock for `@/i18n/navigation`.
   *
   * `Link` is a factory — call `mockIntl.navigation` in `vi.mock` and it
   * returns a plain `<a>`. Override `usePathname` return value via
   * `mockIntl.setPathname()` if your test needs a specific route.
   */
  navigation: {
    Link: 'a' as unknown,
    usePathname: () => pathname,
    useRouter: () => ({ replace, push }),
    getPathname: ({ href }: { href: string }) => href,
  },

  /** Spy on `router.replace` — use in assertions. */
  replace,

  /** Spy on `router.push` — use in assertions. */
  push,

  /** Change the active locale for the current test. */
  setLocale(l: string) {
    locale = l;
  },

  /** Change the pathname returned by `usePathname()`. */
  setPathname(p: string) {
    pathname = p;
  },

  /** Reset locale to `'en'`, pathname to `'/'`, and clear all spies. */
  reset() {
    locale = 'en';
    pathname = '/';
    replace.mockClear();
    push.mockClear();
  },
};
