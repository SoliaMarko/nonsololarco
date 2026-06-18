import Text from '@/src/components/typography/Text';
import {
  CheckSolidIcon,
  // FireIcon, StarOutlineIcon, TrophyIcon
} from '@/src/icons/base';
import { Achievement } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

const ACHIEVEMENT_ICON: Record<Achievement['kind'], typeof CheckSolidIcon> = {
  streak: CheckSolidIcon,
  solo: CheckSolidIcon,
  top3: CheckSolidIcon,
  fire: CheckSolidIcon,
};

const ACHIEVEMENT_COLOR: Record<Achievement['kind'], string> = {
  streak: 'bg-accent-mint',
  solo: 'bg-bg-card',
  top3: 'bg-accent-pink',
  fire: 'bg-bg-card',
};

interface AchievementBadgeProps {
  achievement: Achievement;
  className?: string;
}

export default function AchievementBadge({ achievement, className }: AchievementBadgeProps) {
  const Icon = ACHIEVEMENT_ICON[achievement.kind];
  const colorClass = ACHIEVEMENT_COLOR[achievement.kind];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'border-fg-primary flex h-16 w-16 items-center justify-center rounded-full border-2',
          colorClass,
        )}
      >
        <Icon size={24} aria-hidden="true" />
      </div>
      <Text className="text-fg-tertiary text-center text-xs tracking-widest uppercase">
        {achievement.label}
        {achievement.count ? ` ×${achievement.count}` : null}
      </Text>
    </div>
  );
}
