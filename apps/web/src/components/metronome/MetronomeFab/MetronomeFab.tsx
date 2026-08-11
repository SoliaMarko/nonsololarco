'use client';

import { useEffect, useState } from 'react';

import { MetronomeIcon } from '@/src/icons/base';

/**
 * Floating action button with animated pulse rings that expand and fade
 * over 4.8 s, then stop. Clicking toggles the animation back on.
 *
 * Intended to be placed in a corner of the repertoire page (or similar)
 * as an entry point to the metronome.
 */
export default function MetronomeFab() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(false), 4800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative size-16">
      {animate && (
        <>
          <span
            className="absolute inset-0 rounded-full border-[2.5px] border-yellow-main"
            style={{ animation: 'fab-pulse 1.6s ease-out infinite', zIndex: 1 }}
          />
          <span
            className="absolute inset-0 rounded-full border-[2.5px] border-yellow-main"
            style={{ animation: 'fab-pulse 1.6s ease-out infinite', animationDelay: '0.5s', zIndex: 1 }}
          />
          <span
            className="absolute inset-0 rounded-full border-[2.5px] border-yellow-main"
            style={{ animation: 'fab-pulse 1.6s ease-out infinite', animationDelay: '1s', zIndex: 1 }}
          />
        </>
      )}
      <button
        aria-label="Metronome"
        className="border-primary-dark bg-yellow-main absolute inset-0 z-3 flex items-center justify-center rounded-full border-[2.5px] shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-transform duration-100 hover:-translate-x-px hover:-translate-y-px"
        onClick={() => setAnimate((a) => !a)}
        type="button"
      >
        <MetronomeIcon size={28} className="text-primary-dark" />
      </button>
    </div>
  );
}
