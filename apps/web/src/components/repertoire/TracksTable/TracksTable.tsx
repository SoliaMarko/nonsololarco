import { useSearchParams } from 'next/navigation';

import {
  MOCK_ALL_TRACKS,
  MOCK_BAND_TRACKS,
  MOCK_CURRENT_USER_ID,
} from '@/src/data/repertoire/tracks.mock';
import { Band } from '@/src/lib/types/repertoire/band.types';

import TrackListHeader from './TrackListHeader';
import TrackRow from './TrackListRow';

// Grid columns: # · title · key · bpm · status · duration · actions
export const ALL_BANDS_ROW_GRID =
  'grid grid-cols-[16px_1fr_68px_24px] sm:grid-cols-[16px_32px_3fr_2fr_60px_40px_100px_auto_auto] items-center gap-3';

export const SPECIFIC_BAND_ROW_GRID =
  'grid grid-cols-[16px_1fr_68px_24px] sm:grid-cols-[16px_32px_3fr_60px_40px_100px_auto_auto] items-center gap-3';

interface TracksTableProps {
  bands: Band[];
}

export default function TracksTable({ bands }: TracksTableProps) {
  const searchParams = useSearchParams();

  const activeBandId = searchParams.get('band') ?? '';
  const isBandSelected = Boolean(activeBandId);

  const tracks = isBandSelected ? MOCK_BAND_TRACKS : MOCK_ALL_TRACKS;
  const sortedTracks = [...tracks].sort(
    (a, b) => (a.status === 'archived' ? 1 : 0) - (b.status === 'archived' ? 1 : 0),
  );
  return (
    <div role="table" aria-label="Band repertoire">
      <TrackListHeader />
      {sortedTracks.map((track, index) => (
        <TrackRow
          bands={bands}
          index={index}
          isMyTrack={track.leadMember.id === MOCK_CURRENT_USER_ID}
          key={track.id}
          track={track}
        />
      ))}
    </div>
  );
}
