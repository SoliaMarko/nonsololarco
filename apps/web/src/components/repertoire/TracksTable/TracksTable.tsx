import { MOCK_CURRENT_USER_ID } from '@/src/data/auth/auth.mock';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';

import TrackListHeader from './TrackListHeader';
import TrackListRow from './TrackListRow';

// Grid columns: # · title · key · bpm · status · duration · actions
export const ALL_BANDS_ROW_GRID =
  'grid grid-cols-[16px_1fr_68px_24px] sm:grid-cols-[16px_32px_3fr_2fr_60px_40px_100px_auto_auto] items-center gap-3';

export const SPECIFIC_BAND_ROW_GRID =
  'grid grid-cols-[16px_1fr_68px_24px] sm:grid-cols-[16px_32px_3fr_60px_40px_100px_auto_auto] items-center gap-3';

export default function TracksTable() {
  const { activeBandId, isSpecificBandSelected } = useActiveBand();
  const { data: tracks } = useRepertoireTracks(activeBandId);
  const sortedTracks = tracks
    ? [...tracks].sort(
        (a, b) => (a.status === 'archived' ? 1 : 0) - (b.status === 'archived' ? 1 : 0),
      )
    : [];

  return (
    <div role="table" aria-label="Band repertoire">
      <TrackListHeader />
      {sortedTracks.map((track, index) => (
        <TrackListRow
          index={index}
          isMyTrack={
            !isSpecificBandSelected ||
            (isSpecificBandSelected && track.leadMember.id === MOCK_CURRENT_USER_ID)
          }
          key={track.id}
          track={track}
        />
      ))}
    </div>
  );
}
