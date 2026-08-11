import { useTranslations } from 'next-intl';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { cn } from '@/src/utils/cn';

import { ALL_BANDS_ROW_GRID, SPECIFIC_BAND_ROW_GRID } from '../tracks-table.const';
import TrackColumnHeader from './TrackColumnHeader';

export default function TrackListHeader() {
  const { isSpecificBandSelected } = useActiveBand();
  const t = useTranslations('pages');

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

      {isSpecificBandSelected ? (
        <TrackColumnHeader field="trackOrder" title={t('repertoire.columnNumber')} isSortable={true} />
      ) : (
        <TrackColumnHeader title={t('repertoire.columnNumber')} />
      )}
      <TrackColumnHeader field="title" isSortable={true} title={t('repertoire.columnTitle')} />
      {!isSpecificBandSelected ? (
        <TrackColumnHeader className="hidden sm:flex" title={t('repertoire.columnBand')} />
      ) : null}
      <TrackColumnHeader className="hidden sm:flex" title={t('repertoire.columnKey')} />
      <TrackColumnHeader className="hidden sm:flex" field="bpm" isSortable={true} title={t('repertoire.columnBpm')} />
      <TrackColumnHeader field="status" isSortable={true} title={t('repertoire.columnStatus')} />
      <TrackColumnHeader className="hidden sm:flex" field="time" isSortable={true} title={t('repertoire.columnTime')} />

      <span role="columnheader" aria-hidden="true" />
    </div>
  );
}
