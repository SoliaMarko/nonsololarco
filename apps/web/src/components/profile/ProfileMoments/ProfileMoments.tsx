import { MomentType } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

import Text from '../../typography/Text';
import SectionHeader from '../shared/SectionHeader';
import MomentCard from './MomentCard';

export interface ProfileMomentsProps {
  className?: string;
  isOwnProfile?: boolean;
  moments: MomentType[];
}

export default function ProfileMoments({ moments, isOwnProfile, className }: ProfileMomentsProps) {
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
      <SectionHeader title="Moments" meta="photos and videos · drag your" />
      <Text className="text-fg-tertiary mbe-4 shrink-0 text-xs tracking-widest uppercase sm:hidden">
        photos and videos · drag your
      </Text>

      <div
        className={cn(
          'grid grid-cols-1 gap-4',
          featured ? 'md:grid-cols-2 lg:grid-cols-[1.4fr_1fr]' : 'md:grid-cols-2',
        )}
      >
        {featured ? (
          <MomentCard
            moment={featured}
            isOwnProfile={isOwnProfile}
            className="min-h-46 sm:min-h-80"
          />
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          {rest.map((moment) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              isOwnProfile={isOwnProfile}
              className="min-h-36"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
