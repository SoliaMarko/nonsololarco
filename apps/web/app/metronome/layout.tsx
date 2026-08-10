import { Alfa_Slab_One, Oswald, Space_Mono, Spectral } from 'next/font/google';

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

export default function MetronomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${alfaSlabOne.variable} ${oswald.variable} ${spaceMono.variable} ${spectral.variable}`}
    >
      {children}
    </div>
  );
}
