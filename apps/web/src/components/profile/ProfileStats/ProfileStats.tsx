import { useTranslations } from 'next-intl';

import { PROFILE_STATS } from '@/src/lib/constants/profile/profile.const';
import { ProfileType } from '@/src/lib/types/profile.types';
import { cn } from '@/src/utils/cn';

export interface ProfileStatsProps {
  className?: string;
  profile: ProfileType;
}

export default function ProfileStats({ className, profile }: ProfileStatsProps) {
  const t = useTranslations('pages');

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4',
        'border-border-primary border-b-2',
        className,
      )}
    >
      {PROFILE_STATS.map((stat, index) => {
        const Icon = stat.icon;
        const value = profile[stat.valueKey] ?? 0;

        return (
          <div
            key={stat.valueKey}
            className={cn(
              'relative flex flex-col justify-between gap-2',
              'pli-6 plb-5',
              'border-border-primary',
              'md:border-r md:last:border-r-0',
              { 'border-r': index % 2 === 0 },
              { 'border-b md:border-b-0': index < 2 },
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={cn(
                  'text-5xl leading-none font-black tracking-tight',
                  stat.isPicks ? 'text-danger' : 'text-fg-primary',
                )}
              >
                {value}
              </span>
              <Icon className={cn('mbs-1 shrink-0', stat.color)} size={20} />
            </div>

            <span className="text-fg-tertiary text-xs font-medium tracking-widest uppercase">
              {t(stat.labelKey)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
