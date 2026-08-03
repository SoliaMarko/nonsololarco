import { useSearchParams } from 'next/navigation';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';
import { cn } from '@/src/utils/cn';
import { SortField, SortOrder } from '@/src/utils/tracks-sort.utils';

import TrackListHeader from './TrackListHeader';
import TrackListRow from './TrackListRow';

export default function TracksTable() {
  const { user } = useAuth();
  const { activeBandId, isSpecificBandSelected } = useActiveBand();
  const searchParams = useSearchParams();

  const sortField = (searchParams.get('sort') as SortField) ?? undefined;
  const sortOrder = (searchParams.get('order') as SortOrder) ?? undefined;

  const { data: tracks, isFetching } = useRepertoireTracks(activeBandId, sortField, sortOrder);

  return (
    <div
      role="table"
      aria-label="Band repertoire"
      aria-busy={isFetching}
      className={cn('transition-opacity duration-150', isFetching && 'pointer-events-none opacity-60')}
    >
      <TrackListHeader />
      {(tracks ?? []).map((track, index) => (
        <TrackListRow
          index={index}
          isMyTrack={
            !isSpecificBandSelected ||
            (isSpecificBandSelected && track.leadMember.id === user?.id)
          }
          key={track.id}
          track={track}
        />
      ))}
    </div>
  );
}
