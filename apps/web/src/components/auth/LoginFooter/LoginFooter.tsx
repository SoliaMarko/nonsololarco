import { cn } from '@/src/utils/cn';

export interface LoginFooterProps {
  className?: string;
}

export default function LoginFooter({ className }: LoginFooterProps) {
  return (
    <div
      className={cn(
        'bg-dots-subtle flex items-center justify-center plb-3 pli-6',
        className,
      )}
      style={{ backgroundColor: 'var(--color-yellow-main)' }}
    >
      <p className="text-primary-dark font-mono text-xs font-bold tracking-widest uppercase">
        <span className="text-accent-red">non solo arco</span>
        {' • '}
        not only the bow
      </p>
    </div>
  );
}
