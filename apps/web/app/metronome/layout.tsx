import { Alfa_Slab_One, Oswald, Space_Mono, Spectral } from 'next/font/google';

import { cn } from '@/src/utils/cn';

const alfaSlabOne = Alfa_Slab_One({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-alfa-slab',
  weight: '400',
});

const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
});

const spectral = Spectral({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  weight: ['400', '500'],
});

/**
 * Route-group layout that scopes the metronome's four display faces to the
 * `/metronome` subtree. Each `next/font` loader emits a CSS-variable class
 * (`--font-alfa-slab` and friends); mounting them on a wrapper here keeps the
 * obfuscated family names available to descendants without leaking them to the
 * rest of the app.
 */
export default function MetronomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(alfaSlabOne.variable, oswald.variable, spaceMono.variable, spectral.variable)}>
      {children}
    </div>
  );
}
