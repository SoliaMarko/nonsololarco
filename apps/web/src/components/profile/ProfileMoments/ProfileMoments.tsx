import { useTranslations } from 'next-intl';

import { MomentType } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/utils/cn';

import Text from '../../typography/Text';
import SectionHeader from '../shared/SectionHeader';
import MomentCard from './MomentCard';

export interface ProfileMomentsProps {
  moments: MomentType[];
  className?: string;
  isOwnProfile?: boolean;
}

export default function ProfileMoments({ moments, isOwnProfile, className }: ProfileMomentsProps) {
  const t = useTranslations('pages');

  const featured = moments.find((moment) => moment.isFeatured);
  const rest = moments.filter((moment) => moment !== featured);

  const featuredCount = moments.filter((m) => m.isFeatured).length;

  if (featuredCount > 1) {
    console.warn(
      `ProfileMoments: ${featuredCount} featured moments found, only the first will be displayed.`,
    );
  }

  return (
    <section className={cn('w-full p-6', className)}>
      <SectionHeader title={t('profile.momentsSection')} meta={t('profile.momentsMediaMeta')} />
      <Text className="text-fg-tertiary mbe-4 shrink-0 text-xs tracking-widest uppercase sm:hidden">
        {t('profile.momentsMediaMeta')}
      </Text>

      <div className={cn('grid grid-cols-1 gap-4', featured ? '' : 'grid-cols-1')}>
        {featured ? (
          <MomentCard
            moment={featured}
            isOwnProfile={isOwnProfile}
            className="xxs:min-h-46 xs:min-h-64 sm:min-h-80 lg:min-h-100"
          />
        ) : null}

        <div className="xs:grid-cols-2 grid grid-cols-1 gap-4">
          {rest.map((moment) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              isOwnProfile={isOwnProfile}
              className="min-h-48 lg:min-h-56"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
