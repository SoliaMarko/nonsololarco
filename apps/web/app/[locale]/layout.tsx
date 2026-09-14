import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Alfa_Slab_One, Oswald, Space_Mono, Spectral } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Locale, locales } from '@/i18n/config';

// Single stylesheet entry on purpose. `globals.css` already pulls in
// tokens.css, and importing it here as well emitted a second chunk whose
// order was not guaranteed — utilities could paint before the custom
// properties existed, which invalidates `border-color` and falls it back
// to `currentColor` (the black-border flash on reload).
import '../globals.css';
import { Providers } from '../providers';

/* --- Retro display faces — see `--font-*` mappings in globals.css @theme ---
 *
 * Subsets are not cosmetic here. A face loaded without the Cyrillic subset
 * renders Ukrainian from a system fallback with different metrics, so the
 * same string measures differently per locale and every bordered element
 * around it shifts when the language changes.
 *
 * Oswald and Spectral ship Cyrillic and request it. Space Mono and Alfa
 * Slab One are Latin-only upstream, so their Cyrillic always comes from the
 * `fallback` stack — pinned explicitly rather than left to the OS, so the
 * substitution is at least the same everywhere.
 */

const alfaSlabOne = Alfa_Slab_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-alfa-slab',
  fallback: ['Georgia', 'serif'],
});
const oswald = Oswald({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-oswald',
  fallback: ['system-ui', 'sans-serif'],
});
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
const spectral = Spectral({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600'],
  variable: '--font-spectral',
  fallback: ['Georgia', 'serif'],
});

const FONT_VARIABLES = [
  alfaSlabOne.variable,
  oswald.variable,
  spaceMono.variable,
  spectral.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'nonsololarco',
  description: 'A social platform for musicians',
};

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
 * Root layout for the `[locale]` segment — owns `<html>`, `<body>` and the
 * `NextIntlClientProvider`.
 *
 * These must live *inside* the `[locale]` segment: a layout above it cannot
 * read the locale param, so `getLocale()` there resolves to the default and
 * every client component would receive the fallback messages no matter what
 * the URL says.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
              } catch {}
            `,
          }}
        />
      </head>
      <body className={`bg-edge bg-dots-subtle box-border ${FONT_VARIABLES}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="mli-auto flex min-h-dvh max-w-7xl flex-col">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
