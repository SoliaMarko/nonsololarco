import Logo from '@/components/ui/Logo';
import { cn } from '@/src/utils/cn';

export interface LoginHeroProps {
  className?: string;
}

export default function LoginHero({ className }: LoginHeroProps) {
  return (
    <div
      className={cn(
        'bg-dots-hero plb-10 pli-6 flex flex-col items-center justify-center gap-2',
        className,
      )}
      style={{ backgroundColor: 'var(--color-emerald-deep)' }}
    >
      <Logo variant="lockup" size="lg" tone="on-brand" />
    </div>
  );
}
