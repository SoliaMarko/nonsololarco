import { ReactNode } from 'react';

import Button from '@/src/components/ui/Button';
import { ArrowRightSolidIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

export interface OAuthButtonProps {
  className?: string;
  href: string;
  icon: ReactNode;
  label: string;
}

export default function OAuthButton({ className, href, icon, label }: OAuthButtonProps) {
  return (
    <a href={href} aria-label={label} className="min-w-0 flex-1 sm:w-full sm:flex-none">
      <Button
        variant="retro-outline"
        size="lg"
        className={cn('bg-btn-fill w-full text-[15px] dark:text-white', className)}
        contentClassName="w-full"
      >
        <span className="flex w-full items-center justify-center sm:justify-between">
          <span className="flex items-center gap-3">
            <span className="shrink-0">{icon}</span>
            <span className="hidden text-start sm:inline">{label}</span>
          </span>
          <ArrowRightSolidIcon size={16} className="hidden shrink-0 sm:block" aria-hidden />
        </span>
      </Button>
    </a>
  );
}
