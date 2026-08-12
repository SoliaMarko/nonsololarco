'use client';

import { CheckCircleIcon } from '@/src/icons/base';

interface MetronomeToastProps {
  message: string;
}

/**
 * Animated toast notification that slides up from the bottom of the
 * metronome stage.
 */
export default function MetronomeToast({ message }: MetronomeToastProps) {
  return (
    <div
      aria-live="polite"
      className="pli-4 plb-3 font-ui border-primary-dark bg-emerald-deep text-primary-light absolute bottom-5.5 left-1/2 z-40 inline-flex w-fit -translate-x-1/2 items-center gap-2.5 border-2 text-sm font-medium shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
      role="status"
      style={{ animation: 'mt-toast-in 0.3s ease-out' }}
    >
      <CheckCircleIcon size={17} className="text-emerald-light" />
      {message}
    </div>
  );
}
