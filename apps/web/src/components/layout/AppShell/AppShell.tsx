import { ReactNode } from 'react';

import MetronomeButton from '@/src/components/shared/MetronomeButton';
import { cn } from '@/src/utils/cn';

import AppBottomNav from './AppBottomNav';
import AppHeaderNav from './AppHeaderNav';

export interface AppShellProps {
  activePath: string;
  children: ReactNode;
  activeTitle?: string;
  className?: string;
  mainClassName?: string;
}

/**
 * AppShell — root layout wrapper for authenticated pages.
 *
 * Renders:
 * - AppHeader (sticky top, desktop nav)
 * - main content area
 * - AppBottomNav (fixed bottom, mobile only)
 *
 * @example
 * <AppShell activePath="/repertoire">
 *   <RepertoirePage />
 * </AppShell>
 */
export default function AppShell({
  activePath,
  activeTitle,
  children,
  className,
  mainClassName,
}: AppShellProps) {
  return (
    <div
      className={cn(
        'bg-card text-text-primary border-border-primary relative flex min-h-full flex-1 flex-col',
        'shadow-[4px_4px_0px_0px_var(--border-primary)] xl:border-t-[2.5px] xl:border-l-[2.5px]',
        className,
      )}
    >
      <AppHeaderNav activePath={activePath} activeTitle={activeTitle} />
      <main className={cn('mli-auto relative w-full flex-1', mainClassName)}>{children}</main>

      {/* Mobile-only metronome shortcut. Fixed to the bottom-end corner —
          the natural thumb reach — and lifted clear of AppBottomNav plus the
          iPhone home indicator. Above md it lives in the header instead. */}
      <MetronomeButton className="block-end-20 fixed inset-e-4 z-45 md:hidden" variant="fab" />

      <AppBottomNav activePath={activePath} />
    </div>
  );
}
