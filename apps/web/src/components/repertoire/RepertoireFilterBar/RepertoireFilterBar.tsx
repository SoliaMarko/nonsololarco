'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import Dropdown from '@/src/components/ui/Dropdown';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { ArrowRightSolidIcon, ChevronIcon, SortIcon } from '@/src/icons/base';
import { SOLO_BAND_ID, useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';
import {
  onlyMineCountVariants,
  onlyMineToggleVariants,
} from '@/src/lib/variants/only-mine-toggle.variants';
import { cn } from '@/src/utils/cn';
import { SortField, SortOrder, TrackFilterParam } from '@/src/utils/tracks-sort.utils';

import FilterPill from './FilterPill';

const STATUS_FILTERS: { label: string; value: TrackFilterParam }[] = [
  { label: 'All', value: 'all' },
  { label: 'Ready', value: 'ready' },
  { label: 'Learning', value: 'learning' },
  { label: 'New', value: 'new' },
];

const EXTRA_FILTERS: { label: string; value: TrackFilterParam }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Archive', value: 'archived' },
];

const ACTIVE_STYLE: Record<TrackFilterParam, string> = {
  all: 'border-fg-primary text-fg-primary bg-base',
  ready: 'border-emerald-main text-emerald-main bg-emerald-subtle',
  learning: 'border-yellow-main text-yellow-deep bg-yellow-subtle',
  new: 'border-accent-red text-accent-red bg-danger-subtle',
  active: 'border-fg-primary text-fg-primary bg-base',
  archived: 'border-fg-tertiary text-fg-tertiary bg-base',
};

/** Encodes sort field + order into a single dropdown value, e.g. `"bpm:asc"` */
function encodeSortValue(field: SortField, order: SortOrder): string {
  return `${field}:${order}`;
}

/** Decodes a dropdown value back into field + order, or `null` for the default */
function decodeSortValue(value: string): { field: SortField; order: SortOrder } | null {
  if (value === 'default') return null;
  const [field, order] = value.split(':') as [SortField, SortOrder];
  return { field, order };
}

const SORT_OPTIONS_COMMON = [
  { label: 'Title A→Z', value: encodeSortValue('title', 'asc') },
  { label: 'Title Z→A', value: encodeSortValue('title', 'desc') },
  { label: 'BPM ↑', value: encodeSortValue('bpm', 'asc') },
  { label: 'BPM ↓', value: encodeSortValue('bpm', 'desc') },
  { label: 'Status', value: encodeSortValue('status', 'desc') },
  { label: 'Time ↑', value: encodeSortValue('time', 'asc') },
  { label: 'Time ↓', value: encodeSortValue('time', 'desc') },
];

const ORDER_OPTION = { label: '# Order', value: encodeSortValue('trackOrder', 'asc') };

/** Maps the current URL params to the composite dropdown value */
function currentSortDropdownValue(sortField: string | null, sortOrder: string | null): string {
  if (!sortField) return 'default';
  return encodeSortValue(sortField as SortField, (sortOrder as SortOrder) ?? 'asc');
}

/**
 * URL-driven filter and sort toolbar for the repertoire table.
 *
 * Reads `status`, `onlyMine`, `sort` and `order` from the URL search params,
 * and writes changes back via `router.push`. Resets `page` to 1 on every
 * filter/sort change so the user never lands on an out-of-range page.
 */
export default function RepertoireFilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { activeBand, activeBandId, isSpecificBandSelected } = useActiveBand();

  const currentFilter = (searchParams.get('status') as TrackFilterParam) ?? 'all';
  const isMineActive = searchParams.get('onlyMine') === 'true';
  const sortField = searchParams.get('sort');
  const sortOrder = searchParams.get('order');

  /** "Only mine" and participation legend are only relevant for real bands (not Solo/All) */
  const isRealBand = isSpecificBandSelected && activeBandId !== SOLO_BAND_ID;

  /**
   * Unfiltered, unpaginated query to derive badge counts.
   *
   * No `page` param → the API returns every matching track in one response,
   * so counts are always across the full repertoire. This is correct but
   * wasteful at scale — a dedicated `/counts` endpoint would let us drop
   * this extra fetch once repertoires grow large.
   */
  const { data: allTracks } = useRepertoireTracks(activeBandId);

  const tracks = allTracks?.data;
  const archivedCount = tracks?.filter((t) => t.status === 'archived').length ?? 0;
  const activeCount = tracks?.filter((t) => t.status !== 'archived').length ?? 0;
  const mineCount =
    tracks?.filter((t) => t.leadMember.id === user?.id || t.members?.some((m) => m.id === user?.id))
      .length ?? 0;

  const mobileSortOptions: { label: string; value: string }[] = isSpecificBandSelected
    ? [ORDER_OPTION, ...SORT_OPTIONS_COMMON]
    : SORT_OPTIONS_COMMON;

  const activeSortValue = currentSortDropdownValue(sortField, sortOrder);
  const activeSortLabel = mobileSortOptions.find((o) => o.value === activeSortValue)?.label;

  function setFilter(value: TrackFilterParam) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === currentFilter) {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function toggleMine() {
    const params = new URLSearchParams(searchParams.toString());
    if (isMineActive) {
      params.delete('onlyMine');
    } else {
      params.set('onlyMine', 'true');
    }
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function handleMobileSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const isAlreadyActive = value === activeSortValue;
    const decoded = decodeSortValue(value);
    if (isAlreadyActive || !decoded) {
      params.delete('sort');
      params.delete('order');
    } else {
      params.set('sort', decoded.field);
      params.set('order', decoded.order);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border-border-primary bg-base border-b">
      {/* Desktop layout */}
      <div className="pli-4 plb-3 hidden items-center gap-3 sm:flex">
        {/* Status filter pills */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Filter by status</legend>
          {STATUS_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              isActive={currentFilter === value}
              label={label}
              onClick={() => setFilter(value)}
              activeStyle={ACTIVE_STYLE[value]}
            />
          ))}
        </fieldset>

        <div className="bg-border-primary h-6 w-px" />

        {/* Extra filters with counts */}
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Activity filter</legend>
          {EXTRA_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              isActive={currentFilter === value}
              label={label}
              count={value === 'archived' ? archivedCount : activeCount}
              onClick={() => setFilter(value)}
              activeStyle={ACTIVE_STYLE[value]}
            />
          ))}
        </fieldset>

        {/* Only mine toggle */}
        {isRealBand ? (
          <>
            <div className="bg-border-primary h-6 w-px" />
            <button
              aria-pressed={isMineActive}
              onClick={toggleMine}
              className={cn(
                onlyMineToggleVariants({ active: isMineActive }),
                !isMineActive && 'hover:border-fg-tertiary',
              )}
            >
              <StarOutlineIcon size={14} />
              <span>Only mine</span>
              <span className={onlyMineCountVariants({ active: isMineActive })}>
                {mineCount}
              </span>
            </button>
          </>
        ) : null}

        {/* Spacer */}
        <div className="grow" />

        {/* Band page link */}
        {isSpecificBandSelected && activeBand ? (
          <Link
            href={`/band/${activeBandId}`}
            className="bg-contrast text-primary-light dark:text-primary-dark plb-2 pli-4 flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors hover:opacity-90"
          >
            <span>Page &laquo; {activeBand.name} &raquo;</span>
            <ArrowRightSolidIcon size={12} />
          </Link>
        ) : null}

        {/* My participation legend */}
        {isRealBand ? (
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider">
            <span className="bg-emerald-subtle border-emerald-main inline-block size-4 border" />
            <span className="text-fg-tertiary uppercase">my participation</span>
          </div>
        ) : null}
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col sm:hidden">
        {/* Band page link — full-width, no spacing */}
        {isSpecificBandSelected && activeBand ? (
          <Link
            href={`/band/${activeBandId}`}
            className="bg-yellow-deep text-primary-dark plb-2.5 pli-4 flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase"
          >
            <span>Page &laquo; {activeBand.name} &raquo;</span>
            <ArrowRightSolidIcon size={12} />
          </Link>
        ) : null}

        {/* Scrollable filter pills */}
        <div className="pli-4 plb-3 flex scrollbar-none items-center gap-2 overflow-x-auto">
          {STATUS_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              isActive={currentFilter === value}
              label={label}
              onClick={() => setFilter(value)}
              activeStyle={ACTIVE_STYLE[value]}
            />
          ))}
          <div className="bg-border-primary h-6 w-px shrink-0" />
          {EXTRA_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              isActive={currentFilter === value}
              label={label}
              count={value === 'archived' ? archivedCount : activeCount}
              onClick={() => setFilter(value)}
              activeStyle={ACTIVE_STYLE[value]}
            />
          ))}
        </div>

        {/* Only mine + sort dropdown row */}
        <div className="pli-4 plb-3 border-border-primary flex items-center gap-3 border-t">
          {isRealBand ? (
            <button
              aria-pressed={isMineActive}
              onClick={toggleMine}
              className={onlyMineToggleVariants({ active: isMineActive })}
            >
              <StarOutlineIcon size={14} />
              <span>Only mine</span>
              <span className={onlyMineCountVariants({ active: isMineActive })}>
                {mineCount}
              </span>
            </button>
          ) : null}

          {/* Sort dropdown */}
          <Dropdown
            align="start"
            side="bottom"
            trigger={
              <button
                className={cn(
                  'plb-1.5 pli-3 flex items-center gap-2 border-2 text-xs font-bold tracking-wider uppercase transition-colors',
                  'border-border-primary text-fg-tertiary hover:text-fg-secondary hover:border-fg-tertiary',
                  activeSortLabel && 'border-fg-primary text-fg-primary',
                )}
              >
                <SortIcon size={14} />
                <span>{activeSortLabel ?? 'Sort'}</span>
                <ChevronIcon size={10} direction="down" />
              </button>
            }
            groups={[
              {
                items: mobileSortOptions.map((opt) => ({
                  label: opt.label,
                  selected: opt.value === activeSortValue,
                  onClick: () => handleMobileSort(opt.value),
                })),
              },
            ]}
          />

          <span className="text-fg-tertiary mis-auto text-xs tabular-nums">
            {tracks?.length ?? 0} in group
          </span>
        </div>
      </div>
    </div>
  );
}
