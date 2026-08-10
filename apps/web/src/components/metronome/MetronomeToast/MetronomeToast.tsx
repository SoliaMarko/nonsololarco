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
      className="absolute inset-x-0 bottom-[22px] z-40 mli-auto inline-flex w-fit items-center gap-2.5 border-2 border-primary-dark bg-emerald-deep text-primary-light"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Oswald', sans-serif",
        fontWeight: 500,
        fontSize: '14px',
        padding: '11px 18px',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
        animation: 'mt-toast-in 0.3s ease-out',
      }}
    >
      <CheckCircleIcon size={17} className="text-emerald-light" />
      {message}
    </div>
  );
}
