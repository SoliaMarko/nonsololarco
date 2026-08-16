import { useTranslations } from 'next-intl';

import { ACHIEVEMENT_KIND_COLOR_CONFIG } from '@/src/data/profile/sidebar.mock';
import AchievementBadge from '@/src/illustrations/achievements/AchievementBadge';
import { Achievement } from '@/src/lib/types/profile/profile.types';

import SectionHeader from '../../shared/SectionHeader';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export default function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const t = useTranslations('pages');

  return (
    <section>
      <SectionHeader className="mbe-4 sm:mbe-4" title={t('profile.achievementsSection')} />
      <div className="xxs:grid-cols-3 grid gap-4 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <AchievementBadge
            color={ACHIEVEMENT_KIND_COLOR_CONFIG[achievement.kind]}
            key={achievement.id}
            icon={achievement.icon}
            label={achievement.label}
          />
        ))}
      </div>
    </section>
  );
}
