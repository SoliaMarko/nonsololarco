'use client';

import { Suspense } from 'react';

import AppShell from '@/src/components/layout/AppShell';
import Repertoire from '@/src/components/repertoire';
import Spinner from '@/src/components/ui/Spinner';

export default function RepertoirePage() {
  return (
    <AppShell activePath={'/repertoire'}>
      <Suspense
        fallback={
          <div className="mli-auto flex h-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Repertoire />
      </Suspense>
    </AppShell>
  );
}
