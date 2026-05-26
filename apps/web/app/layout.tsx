import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '../src/styles/tokens.css';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="bg-card text-fg-primary rounded-md"></div>
        {children}
      </body>
    </html>
  );
}
