import { type ElementType } from 'react';

import Link from 'next/link';

import { type VariantProps } from 'class-variance-authority';

import TabItem from '@/src/components/ui/Tabs/TabItem';
import { navLinkVariants } from '@/src/lib/variants/navlink.variants';
import { cn } from '@/src/utils/cn';

export interface NavLinkProps
  extends
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof navLinkVariants> {
  /** Badge count shown on icon (e.g. unread messages) */
  badge?: number;
  className?: string;
  href: string;
  icon: ElementType;
  label: string;
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
        <Link
          href={href}
          aria-current={isActive ? 'page' : undefined}
          {...props}
        >
          <span className="relative shrink-0">
            <Icon className="size-5 transition-colors" aria-hidden="true" />
            {badge !== undefined && badge > 0 && (
              <span
                className="bg-accent-red pli-0.5 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white"
                aria-label={`${badge} unread`}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </span>
          <span>{label}</span>
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
          className={cn(
            'size-5 transition-colors',
            isActive ? 'text-accent-red' : '',
          )}
          aria-hidden="true"
        />
        {badge !== undefined && badge > 0 && (
          <span
            className="bg-accent-red pli-0.5 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white"
            aria-label={`${badge} unread`}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
      <span className="leading-none">{label}</span>
    </Link>
  );
}
