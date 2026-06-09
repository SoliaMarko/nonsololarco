import { type ElementType } from 'react';

import Link from 'next/link';

import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/src/lib/ui/utils/cn';
import { navLinkVariants } from '@/src/lib/ui/variants/navlink.variants';

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
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        navLinkVariants({ variant, isActive }),
        { 'border-accent-red rounded-none border-b-2 pbe-1.5': variant === 'desktop' && isActive },
        { 'hover:text-fg-primary': !isActive },
        className,
      )}
      {...props}
    >
      <span className="relative shrink-0">
        <Icon
          className={cn(
            'transition-colors',
            variant === 'desktop' ? 'size-4' : 'size-5',
            variant === 'mobile' && isActive ? 'text-accent-red' : '',
          )}
          aria-hidden="true"
        />
        {badge !== undefined && badge > 0 && (
          <span
            className="bg-accent-red pli-0.5 absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px] leading-none font-bold text-white"
            aria-label={`${badge} непрочитаних`}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>

      <span className={cn(variant === 'mobile' && 'leading-none')}>{label}</span>
    </Link>
  );
}
