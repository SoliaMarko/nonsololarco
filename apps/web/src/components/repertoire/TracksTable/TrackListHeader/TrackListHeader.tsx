import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { cn } from '@/src/utils/cn';

import { ALL_BANDS_ROW_GRID, SPECIFIC_BAND_ROW_GRID } from '../tracks-table.const';
import TrackColumnHeader from './TrackColumnHeader';

export default function TrackListHeader() {
  const { isSpecificBandSelected } = useActiveBand();

  return (
    <div
      role="row"
      className={cn(
        'bg-surface border-border-primary pli-4 plb-2 border-b',
        // Mirror the rows' horizontal borders (transparent) so both grids share one content box
        'border-x-1.5 border-l-3 border-x-transparent',
        isSpecificBandSelected ? SPECIFIC_BAND_ROW_GRID : ALL_BANDS_ROW_GRID,
      )}
    >
      <span className="hidden sm:inline" role="columnheader" aria-hidden="true" />

      <TrackColumnHeader title="#" />
      <TrackColumnHeader field="title" isSortable={true} title="Title" />
      {!isSpecificBandSelected ? (
        <TrackColumnHeader className="hidden sm:flex" title="Band" />
      ) : null}
      <TrackColumnHeader className="hidden sm:flex" title="Key" />
      <TrackColumnHeader className="hidden sm:flex" field="bpm" isSortable={true} title="BPM" />
      <TrackColumnHeader field="status" isSortable={true} title="Status" />
      <TrackColumnHeader className="hidden sm:flex" field="time" isSortable={true} title="Time" />

      <span role="columnheader" aria-hidden="true" />
    </div>
  );
}
