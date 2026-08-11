import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { Locale, locales } from '@/i18n/config';

/**
 * Generates static params for all supported locales so Next.js can
 * pre-render locale-prefixed routes at build time.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Layout for the `[locale]` segment.
 *
 * Validates the locale param and enables static rendering via
 * `setRequestLocale`. The `NextIntlClientProvider` is handled
 * automatically by the next-intl plugin when `i18n/request.ts`
 * is configured.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return children;
}
