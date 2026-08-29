import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import Text from '@/src/components/typography/Text';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord/VinylRecord';
import { Band } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/utils/cn';

interface BandRowProps {
  band: Band;
  className?: string;
  isLastItem?: boolean;
}

/**
 * Linked row in the profile sidebar bands list.
 * Shows the band's vinyl avatar, name, the user's role, and the year they joined.
 */
export default function BandRow({ band, className, isLastItem }: BandRowProps) {
  const t = useTranslations('pages');

  return (
    <Link
      href={`/band/${band.id}`}
      className={cn(
        'flex items-center',
        'border-fg-primary/10 border-b',
        'hover:bg-fg-primary/5 transition-colors duration-150',
        'rounded-sm p-2',
        { 'last:border-b-0': isLastItem },
      )}
    >
      <div className={cn('flex items-center gap-3', className)}>
        <div className="bg-fg-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <VinylRecord size={36} />
        </div>
        <div className="flex flex-col">
          <Text className="text-fg-primary font-black">{band.name}</Text>
          <Text className="text-fg-tertiary text-sm">
            {band.role}
            {band.since ? ` · ${t('profile.bandSince', { since: band.since })}` : null}
          </Text>
        </div>
      </div>
    </Link>
  );
}
