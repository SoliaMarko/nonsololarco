import { ReactNode } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

import AppBottomNav from './AppBottomNav';
import AppHeaderNav from './AppHeaderNav';

export interface AppShellProps {
  activePath: string;
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
 * <AppShell navItems={NAV_ITEMS} activePath="/repertoire" picks={42}>
 *   <RepertoirePage />
 * </AppShell>
 */
export default function AppShell({ activePath, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        'bg-card text-text-primary border-border-primary relative flex min-h-full flex-1 flex-col',
        'shadow-[4px_4px_0px_0px_var(--border-primary)] xl:border-t-[2.5px] xl:border-l-[2.5px]',
        className,
      )}
    >
      <AppHeaderNav activePath={activePath} />

      <main className="mli-auto pli-4 plb-6 relative w-full flex-1">{children}</main>

      <AppBottomNav activePath={activePath} />
    </div>
  );
}
