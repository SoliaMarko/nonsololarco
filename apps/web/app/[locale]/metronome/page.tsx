'use client';

import { Suspense } from 'react';

import { MetronomeScreen } from '@/src/components/metronome';
import Spinner from '@/src/components/ui/Spinner';

export default function MetronomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#14100b]">
          <Spinner size="xl" />
        </div>
      }
    >
      <MetronomeScreen />
    </Suspense>
  );
}
