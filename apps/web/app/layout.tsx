import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import '@/styles/tokens.css';

import './globals.css';
import { Providers } from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'nonsololarco',
  description: 'A social platform for musicians',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
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
      <body
        className={`bg-edge bg-dots-subtle box-border ${geistSans.variable} ${geistMono.variable}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="mli-auto flex min-h-dvh max-w-7xl flex-col">{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
