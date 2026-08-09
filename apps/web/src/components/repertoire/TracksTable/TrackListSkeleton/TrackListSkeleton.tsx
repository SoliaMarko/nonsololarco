import Skeleton from '@/src/components/ui/Skeleton';
import { cn } from '@/src/utils/cn';

import { ALL_BANDS_ROW_GRID, SPECIFIC_BAND_ROW_GRID } from '../tracks-table.const';

/** Rows to draw when we have no previous count to match — roughly one screen. */
const DEFAULT_ROW_COUNT = 8;

export interface TrackListSkeletonProps {
  /** Must match the real table, or the placeholder columns won't line up */
  isSpecificBandSelected: boolean;
  /** Defaults to a screenful. Pass the outgoing row count to avoid a height jump */
  rowCount?: number;
}

/**
 * Placeholder rows shown while the first page of tracks loads.
 *
 * Only for the initial load — once there are rows on screen, a refetch keeps
 * them visible and overlays a spinner instead, which reads as "updating"
 * rather than "starting over".
 */
export default function TrackListSkeleton({
  isSpecificBandSelected,
  rowCount = DEFAULT_ROW_COUNT,
}: TrackListSkeletonProps) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rowCount }, (_, index) => (
        <div
          key={index}
          className={cn(
            'border-border-primary dark:border-fg-primary/30 border-1.5 border-b border-s-3 border-s-transparent',
            'pli-4 plb-3',
            isSpecificBandSelected ? SPECIFIC_BAND_ROW_GRID : ALL_BANDS_ROW_GRID,
          )}
        >
          {/* ★ */}
          <Skeleton className="hidden sm:block" height={14} rounded="sm" width={14} />
          {/* # */}
          <Skeleton height={12} width="60%" />
          {/* title + performers */}
          <div className="flex flex-col gap-1.5">
            <Skeleton height={12} width="70%" />
            <Skeleton className="hidden sm:block" height={9} width="40%" />
          </div>
          {/* band — only in the all-bands grid */}
          {!isSpecificBandSelected ? (
            <Skeleton className="hidden sm:block" height={12} width="55%" />
          ) : null}
          {/* key */}
          <Skeleton className="hidden sm:block" height={12} width="70%" />
          {/* bpm */}
          <Skeleton className="hidden sm:block" height={12} width="80%" />
          {/* status badge */}
          <Skeleton height={20} rounded="sm" width="85%" />
          {/* duration */}
          <Skeleton className="hidden sm:block" height={12} width="70%" />
          {/* chevron */}
          <Skeleton height={14} rounded="sm" width={14} />
        </div>
      ))}
    </div>
  );
}
