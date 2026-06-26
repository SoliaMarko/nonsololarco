import { ReactNode } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

import AppBottomNav from './AppBottomNav';
import AppHeaderNav from './AppHeaderNav';

export interface AppShellProps {
  activePath: string;
  activeTitle?: string;
  children: ReactNode;
  className?: string;
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
export default function AppShell({ activePath, activeTitle, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        'bg-card text-text-primary border-border-primary relative flex min-h-full flex-1 flex-col',
        'shadow-[4px_4px_0px_0px_var(--border-primary)] xl:border-t-[2.5px] xl:border-l-[2.5px]',
        className,
      )}
    >
      <AppHeaderNav activePath={activePath} activeTitle={activeTitle} />
      <main className="mli-auto relative w-full flex-1">{children}</main>
      <AppBottomNav activePath={activePath} />
    </div>
  );
}
