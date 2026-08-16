'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import NoDataCard from '@/src/components/shared/NoDataCard';
import Button from '@/src/components/ui/Button';
import Pagination from '@/src/components/ui/Pagination';
import Spinner from '@/src/components/ui/Spinner';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { useLockedHeight } from '@/src/hooks/useLockedHeight';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { REPERTOIRE_PAGE_SIZE } from '@/src/lib/constants/repertoire.const';
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
 * Returns the appropriate empty-state translation keys depending on
 * whether the list is filtered, mine-only, or genuinely empty.
 */
function emptyStateCopyKeys(
  hasFilters: boolean,
  onlyMine: boolean,
): { descriptionKey: string; titleKey: string } {
  if (onlyMine) {
    return {
      titleKey: 'repertoire.unmatchedMineTitle',
      descriptionKey: 'repertoire.unmatchedMineDescription',
    };
  }

  if (hasFilters) {
    return {
      titleKey: 'repertoire.filteredEmptyTitle',
      descriptionKey: 'repertoire.filteredEmptyDescription',
    };
  }

  return {
    titleKey: 'repertoire.genuinelyEmptyTitle',
    descriptionKey: 'repertoire.genuinelyEmptyDescription',
  };
}

/**
 * Server-state-driven repertoire table with sorting, status filtering,
 * "only mine" toggle, and cursor pagination.
 *
 * Sort and filter state lives in the URL search params so the view is
 * shareable and survives navigation. On the initial load a skeleton is
 * shown; subsequent refetches dim the outgoing rows and overlay a spinner
 * to read as "updating" rather than "starting over". When the result set
 * is empty, a contextual empty-state card explains why (no tracks at all,
 * active filter matched nothing, or "only mine" matched nothing) with an
 * optional reset button.
 */
export default function TracksTable() {
  const { user } = useAuth();
  const { activeBandId, isSpecificBandSelected } = useActiveBand();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('pages');
  const tCommon = useTranslations('common');

  const rawSortField = (searchParams.get('sort') as SortField) ?? undefined;
  const sortField =
    !isSpecificBandSelected && rawSortField === 'trackOrder' ? undefined : rawSortField;
  const sortOrder = (searchParams.get('order') as SortOrder) ?? undefined;
  const status = (searchParams.get('status') as TrackFilterParam) ?? undefined;
  const onlyMine = searchParams.get('onlyMine') === 'true';
  const page = Math.max(1, Math.floor(Number(searchParams.get('page')) || 1));

  const hasFilters = Boolean(status) || onlyMine;

  const { data, isFetching } = useRepertoireTracks(activeBandId, {
    sort: sortField,
    order: sortOrder,
    status,
    onlyMine: onlyMine || undefined,
    page,
    pageSize: REPERTOIRE_PAGE_SIZE,
  });

  const tracks = data?.data;
  const rowNumberOffset = data ? (data.page - 1) * data.pageSize : 0;

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
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <>
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
                index={rowNumberOffset + index}
                isMyTrack={
                  track.leadMember.id === user?.id ||
                  track.members.some((member) => member.id === user?.id)
                }
                key={track.id}
                track={track}
              />
            ))}
          </div>

          {isEmptyResult ? (
            <div className="pli-4 plb-12 flex items-center justify-center" role="presentation">
              {(() => {
                const keys = emptyStateCopyKeys(hasFilters, onlyMine);
                return (
                  <NoDataCard
                    className="w-full max-w-md"
                    icon={<StarOutlineIcon size={48} className="text-fg-tertiary" />}
                    title={t(keys.titleKey)}
                    description={t(keys.descriptionKey)}
                    action={
                      hasFilters ? (
                        <Button variant="retro-primary" onClick={resetFilters}>
                          {tCommon('actions.reset')}
                        </Button>
                      ) : undefined
                    }
                  />
                );
              })()}
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

      {data && data.totalPages > 1 ? (
        <Pagination currentPage={data.page} onPageChange={goToPage} totalPages={data.totalPages} />
      ) : null}
    </>
  );
}
