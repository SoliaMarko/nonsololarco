import { ReactNode } from 'react';

import { ArrowRightSolidIcon } from '@/src/icons/base';
import { buttonVariants } from '@/src/lib/variants/button.variants';
import { cn } from '@/src/utils/cn';

export interface OAuthButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
  className?: string;
}

// Renders as a single <a> styled like Button's "retro-outline" variant,
// rather than wrapping a <Button> (which renders its own <button>) inside
// the link — nested interactive elements are invalid HTML and confusing
// for screen readers.
export default function OAuthButton({ className, href, icon, label }: OAuthButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      className={cn(
        'relative min-w-0 flex-1 sm:w-full sm:flex-none',
        buttonVariants({ variant: 'retro-outline', size: 'lg' }),
        'bg-btn-fill w-full text-[15px] dark:text-white',
        className,
      )}
    >
      <span className="flex w-full items-center justify-center sm:justify-between">
        <span className="flex items-center gap-3">
          <span className="shrink-0">{icon}</span>
          <span className="hidden text-start sm:inline">{label}</span>
        </span>
        <ArrowRightSolidIcon size={16} className="hidden shrink-0 sm:block" aria-hidden />
      </span>
    </a>
  );
}
