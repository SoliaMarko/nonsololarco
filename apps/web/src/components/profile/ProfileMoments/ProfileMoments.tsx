import { ORIENTATION } from '@/src/lib/constants/common.const';
import { MomentType } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

import Heading from '../../typography/Heading';
import Text from '../../typography/Text';
import Divider from '../../ui/Divider';
import MomentCard from './MomentCard';

export interface ProfileMomentsProps {
  className?: string;
  isOwnProfile?: boolean;
  moments: MomentType[];
}

export default function ProfileMoments({ moments, isOwnProfile, className }: ProfileMomentsProps) {
  const featured = moments.find((m) => m.isFeatured);
  const rest = moments.filter((m) => m !== featured);

  const featuredCount = moments.filter((m) => m.isFeatured).length;

  if (featuredCount > 1) {
    console.warn(
      `ProfileMoments: ${featuredCount} featured moments found, only the first will be displayed.`,
    );
  }

  return (
    <section className={cn('w-full p-6', className)}>
      {/* Section header */}
      <div className="flex items-center gap-4 sm:mbe-6">
        <Heading tag="h2" className="shrink-0">
          Moments
        </Heading>
        <Divider className="w-full" orientation={ORIENTATION.horizontal} />
        <Text className="text-fg-tertiary hidden shrink-0 text-xs tracking-widest uppercase sm:block">
          photos and videos · drag your
        </Text>
      </div>
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
