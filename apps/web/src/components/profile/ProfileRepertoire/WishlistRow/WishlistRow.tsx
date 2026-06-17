import Text from '@/src/components/typography/Text';
import { WishlistTrack } from '@/src/lib/types/repertoire/repertoire.types';
import { cn } from '@/src/lib/ui/utils/cn';

import MediaChip from '../../shared/MediaChip';

interface WishlistRowProps {
  hasMoreWishes?: boolean;
  track: WishlistTrack;
}

export default function WishlistRow({ hasMoreWishes, track }: WishlistRowProps) {
  return (
    <div
      className={cn('plb-4 pli-2 border-fg-primary/10 flex items-center gap-3 border-b', {
        'last:border-b-0': !hasMoreWishes,
      })}
    >
      <span className="text-accent-red shrink-0" aria-hidden="true">
        ♥
      </span>
      <Text className="text-fg-primary flex-1 font-black">{track.title}</Text>
      <div className="flex flex-wrap items-center gap-1.5">
        {track.media.map((mediaItem) => (
          <MediaChip
            key={`${mediaItem.kind}-${mediaItem.label}`}
            kind={mediaItem.kind}
            label={mediaItem.label}
            url="#"
          />
        ))}
      </div>
    </div>
  );
}
