'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { SOLO_BAND_ID, useRepertoireTracks } from '@/src/lib/hooks/useRepertoire';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { ArrowRightSolidIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';
import { TrackFilterParam } from '@/src/utils/tracks-sort.utils';

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

export default function RepertoireFilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { activeBand, activeBandId, isSpecificBandSelected } = useActiveBand();

  const currentFilter = (searchParams.get('status') as TrackFilterParam) ?? 'all';
  const isMineActive = searchParams.get('onlyMine') === 'true';

  /** "Only mine" and participation legend are only relevant for real bands (not Solo/All) */
  const isRealBand = isSpecificBandSelected && activeBandId !== SOLO_BAND_ID;

  /** Unfiltered query to derive counts */
  const { data: allTracks } = useRepertoireTracks(activeBandId);

  const archivedCount = allTracks?.filter((t) => t.status === 'archived').length ?? 0;
  const activeCount = allTracks?.filter((t) => t.status !== 'archived').length ?? 0;
  const mineCount =
    allTracks?.filter((t) => t.leadMember.id === user?.id || t.members?.some((m) => m.id === user?.id)).length ?? 0;

  function setFilter(value: TrackFilterParam) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.push(`?${params.toString()}`);
  }

  function toggleMine() {
    const params = new URLSearchParams(searchParams.toString());
    if (isMineActive) {
      params.delete('onlyMine');
    } else {
      params.set('onlyMine', 'true');
    }
    router.push(`?${params.toString()}`);
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
            onClick={toggleMine}
            className={cn(
              'plb-1.5 pli-3 flex items-center gap-2 border-2 text-xs font-bold uppercase tracking-wider transition-colors',
              isMineActive
                ? 'border-yellow-deep bg-yellow-main text-primary-dark'
                : 'border-border-primary text-fg-tertiary hover:text-fg-secondary hover:border-fg-tertiary',
            )}
          >
            <StarOutlineIcon size={14} />
            <span>Only mine</span>
            <span
              className={cn(
                'text-[10px] tabular-nums border pli-1.5 plb-0.5',
                isMineActive ? 'border-primary-dark' : 'border-border-primary',
              )}
            >
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
            className="bg-contrast text-primary-light plb-2 pli-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-90"
          >
            <span>Page &laquo; {activeBand.name} &raquo;</span>
            <ArrowRightSolidIcon size={12} />
          </Link>
        ) : null}

        {/* My participation legend */}
        {isRealBand ? (
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider">
            <span className="bg-emerald-subtle inline-block size-4 border border-emerald-main" />
            <span className="text-fg-tertiary uppercase">my participation</span>
          </div>
        ) : null}
      </div>

      {/* Mobile layout */}
      <div className="pli-4 plb-3 flex flex-col gap-3 sm:hidden">
        {/* Band page link on top for mobile */}
        {isSpecificBandSelected && activeBand ? (
          <Link
            href={`/band/${activeBandId}`}
            className="bg-contrast text-primary-light plb-2 pli-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <span>Page &laquo; {activeBand.name} &raquo;</span>
            <ArrowRightSolidIcon size={12} />
          </Link>
        ) : null}

        {/* Filter pills row */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map(({ label, value }) => (
            <FilterPill
              key={value}
              isActive={currentFilter === value}
              label={label}
              onClick={() => setFilter(value)}
              activeStyle={ACTIVE_STYLE[value]}
            />
          ))}
          <div className="bg-border-primary h-6 w-px" />
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

        {/* Only mine + count row */}
        <div className="flex items-center gap-3">
          {isRealBand ? (
            <button
              onClick={toggleMine}
              className={cn(
                'plb-1.5 pli-3 flex items-center gap-2 border-2 text-xs font-bold uppercase tracking-wider transition-colors',
                isMineActive
                  ? 'border-yellow-deep bg-yellow-main text-primary-dark'
                  : 'border-border-primary text-fg-tertiary hover:text-fg-secondary',
              )}
            >
              <StarOutlineIcon size={14} />
              <span>Only mine</span>
              <span
                className={cn(
                  'text-[10px] tabular-nums border pli-1.5 plb-0.5',
                  isMineActive ? 'border-primary-dark' : 'border-border-primary',
                )}
              >
                {mineCount}
              </span>
            </button>
          ) : null}

          <span className="text-fg-tertiary text-xs tabular-nums">
            {allTracks?.length ?? 0} in group
          </span>
        </div>
      </div>
    </div>
  );
}

interface FilterPillProps {
  activeStyle: string;
  count?: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function FilterPill({ activeStyle, count, isActive, label, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'plb-1.5 pli-3 border-2 text-xs font-bold uppercase tracking-wider transition-colors',
        isActive
          ? activeStyle
          : 'border-border-primary text-fg-tertiary hover:text-fg-secondary hover:border-fg-tertiary',
      )}
    >
      {label}
      {count !== undefined ? (
        <span className="mis-1.5 text-[10px] tabular-nums">{count}</span>
      ) : null}
    </button>
  );
}
