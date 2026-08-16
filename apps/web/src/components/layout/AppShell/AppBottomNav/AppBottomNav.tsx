import { useTranslations } from 'next-intl';

import NavLink from '@/src/components/ui/NavLink';
import { NAV_ITEMS } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

export interface AppBottomNavProps {
  activePath: string;
  className?: string;
}

/**
 * Sticky bottom navigation bar visible only on mobile (`md:hidden`).
 * Renders each entry from `NAV_ITEMS` as a mobile `NavLink` with an
 * optional badge count. Includes safe-area padding for the iPhone
 * home indicator.
 */
export default function AppBottomNav({ activePath, className }: AppBottomNavProps) {
  const t = useTranslations('common');

  return (
    <nav
      aria-label="Mobile nav"
      className={cn(
        'sticky inset-x-0 bottom-0 z-40 md:hidden',
        'bg-surface border-border-primary border-t',
        // safe area for iPhone home indicator
        'pbe-safe',
        className,
      )}
    >
      <div className="pli-2 plb-1 flex items-center justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey)}
            badge={item.badge}
            variant="mobile"
            isActive={activePath === item.href}
          />
        ))}
      </div>
    </nav>
  );
}
