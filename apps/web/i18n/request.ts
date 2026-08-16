import { getRequestConfig } from 'next-intl/server';

import { Locale, locales } from './config';

/**
 * Server-side configuration for next-intl.
 *
 * Loads all namespace message files (`common`, `auth`, `pages`) for the
 * requested locale and merges them into a single messages object keyed
 * by namespace.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'en';
  }

  const [common, auth, pages] = await Promise.all([
    import(`@/messages/${locale}/common.json`).then((m) => m.default),
    import(`@/messages/${locale}/auth.json`).then((m) => m.default),
    import(`@/messages/${locale}/pages.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages: { common, auth, pages },
  };
});
