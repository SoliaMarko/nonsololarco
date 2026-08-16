import { type ElementType } from 'react';

import { type VariantProps } from 'class-variance-authority';

import { Link } from '@/i18n/navigation';
import TabItem from '@/src/components/ui/Tabs/TabItem';
import { navLinkVariants } from '@/src/lib/variants/navlink.variants';
import { cn } from '@/src/utils/cn';

export interface NavLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof navLinkVariants> {
  href: string;
  icon: ElementType;
  label: string;
  /** Badge count shown on icon (e.g. unread messages) */
  badge?: number;
  className?: string;
}

export default function NavLink({
  href,
  icon: Icon,
  label,
  variant = 'desktop',
  isActive = false,
  badge,
  className,
  ...props
}: NavLinkProps) {
  if (variant === 'desktop') {
    return (
      <TabItem asChild variant="nav" isActive={isActive ?? false} className={className}>
        <Link href={href} aria-current={isActive ? 'page' : undefined} {...props}>
          <span className="relative shrink-0">
            <Icon className="size-5 transition-colors" aria-hidden="true" />
            {badge !== undefined && badge > 0 ? (
              <span
                className="bg-accent-red pli-0.5 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white"
                aria-label={`${badge} unread`}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            ) : null}
          </span>
          {/* Truncates rather than overflowing when the tab is given a fixed
              share of its container and the translated label runs long. */}
          <span className="truncate">{label}</span>
        </Link>
      </TabItem>
    );
  }

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        navLinkVariants({ variant, isActive }),
        { 'hover:text-fg-primary': !isActive },
        className,
      )}
      {...props}
    >
      <span className="relative shrink-0">
        <Icon
          className={cn('size-5 transition-colors', isActive ? 'text-accent-red' : '')}
          aria-hidden="true"
        />
        {badge !== undefined && badge > 0 ? (
          <span
            className="bg-accent-red pli-0.5 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white"
            aria-label={`${badge} unread`}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        ) : null}
      </span>
      <span className="leading-none">{label}</span>
    </Link>
  );
}
