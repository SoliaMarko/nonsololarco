import { useTranslations } from 'next-intl';

import { cn } from '@/src/utils/cn';

export interface LoginFooterProps {
  className?: string;
}

export default function LoginFooter({ className }: LoginFooterProps) {
  const t = useTranslations('auth');

  return (
    <div
      className={cn(
        'bg-dots-subtle flex items-center justify-center plb-3 pli-6',
        className,
      )}
      style={{ backgroundColor: 'var(--color-yellow-main)' }}
    >
      <p className="text-primary-dark font-mono text-xs font-bold tracking-widest uppercase">
        <span className="text-accent-red">{t('loginFooter.brandName')}</span>
        {' • '}
        {t('loginFooter.brandTagline')}
      </p>
    </div>
  );
}
