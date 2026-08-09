'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import NoDataCard from '@/src/components/shared/NoDataCard';
import Button from '@/src/components/ui/Button';
import Spinner from '@/src/components/ui/Spinner';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { useLockedHeight } from '@/src/hooks/useLockedHeight';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';
import { cn } from '@/src/utils/cn';
import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import TrackListHeader from './TrackListHeader';
import TrackListRow from './TrackListRow';
import TrackListSkeleton from './TrackListSkeleton';

interface EmptyStateCopy {
  description: string;
  title: string;
}

/**
 * Why the list came back empty, in the user's terms. Filtered-empty and
 * genuinely-empty are different situations and get different wording.
 */
function emptyStateCopy(hasFilters: boolean, onlyMine: boolean): EmptyStateCopy {
  if (onlyMine) {
    return {
      title: 'You are not involved yet',
      description:
        'No tracks with your part match the current filter. Reset to see the full repertoire.',
    };
  }

  if (hasFilters) {
    return {
      title: 'No tracks match',
      description: 'No tracks match the selected filter. Try a different one or reset.',
    };
  }

  return {
    title: 'Nothing here yet',
    description: 'This repertoire has no tracks.',
  };
}

export default function TracksTable() {
  const { user } = useAuth();
  const { activeBandId, isSpecificBandSelected } = useActiveBand();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSortField = (searchParams.get('sort') as SortField) ?? undefined;
  const sortField = !isSpecificBandSelected && rawSortField === 'trackOrder' ? undefined : rawSortField;
  const sortOrder = (searchParams.get('order') as SortOrder) ?? undefined;
  const status = (searchParams.get('status') as TrackFilterParam) ?? undefined;
  const onlyMine = searchParams.get('onlyMine') === 'true';

  const hasFilters = Boolean(status) || onlyMine;

  const { data: tracks, isFetching } = useRepertoireTracks(activeBandId, {
    sort: sortField,
    order: sortOrder,
    status,
    onlyMine: onlyMine || undefined,
  });

  /**
   * `keepPreviousData` leaves the outgoing rows in place during a refetch, so
   * we can tell "first ever load" (nothing to show) from "updating" (show the
   * old rows behind a spinner).
   */
  const isInitialLoad = isFetching && !tracks;
  const isRefetching = isFetching && Boolean(tracks);

  /** Empty state is a real answer, not a loading state — wait for the fetch. */
  const isEmptyResult = tracks?.length === 0 && !isFetching;

  // Without this the rows unmount before the replacements arrive and the page
  // collapses, which reads as the table "jumping".
  const { minHeight, ref } = useLockedHeight<HTMLDivElement>(isFetching);

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('onlyMine');
    router.push(`?${params.toString()}`);
  }

  return (
    <div role="table" aria-label="Band repertoire" aria-busy={isFetching}>
      <TrackListHeader />

      {/* presentation keeps the positioning wrapper out of the a11y tree, so
          the rowgroup below stays a direct child of the table */}
      <div className="relative" ref={ref} role="presentation" style={{ minHeight }}>
        {isInitialLoad ? (
          <TrackListSkeleton isSpecificBandSelected={isSpecificBandSelected} />
        ) : null}

        <div
          role="rowgroup"
          className={cn(
            'transition-opacity duration-200',
            isRefetching && 'pointer-events-none opacity-40',
          )}
        >
          {(tracks ?? []).map((track, index) => (
            <TrackListRow
              index={index}
              isMyTrack={
                track.leadMember.id === user?.id ||
                track.members?.some((member) => member.id === user?.id)
              }
              key={track.id}
              track={track}
            />
          ))}
        </div>

        {isEmptyResult ? (
          <div className="pli-4 plb-12 flex items-center justify-center" role="presentation">
            <NoDataCard
              className="w-full max-w-md"
              icon={<StarOutlineIcon size={48} className="text-fg-tertiary" />}
              {...emptyStateCopy(hasFilters, onlyMine)}
              action={
                hasFilters ? (
                  <Button variant="retro-primary" onClick={resetFilters}>
                    Reset
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : null}

        {/* Sits over the dimmed rows so the wait has a visible anchor.
            `sticky` keeps it in view when the locked height exceeds the
            viewport — otherwise it can end up scrolled off on a long list. */}
        {isRefetching ? (
          <div
            className="pointer-events-none absolute inset-0 flex justify-center"
            role="presentation"
          >
            <div className="plb-12 sticky top-1/3 h-fit">
              <Spinner label="Updating tracks" size="lg" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
