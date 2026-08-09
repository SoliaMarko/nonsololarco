'use client';

import { useState } from 'react';

import Link from 'next/link';

import Text from '@/src/components/typography/Text';
import Badge from '@/src/components/ui/Badge';
import { useActiveBand } from '@/src/hooks/global/useActiveBand';
import { useAuth } from '@/src/hooks/global/useAuth';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { ChevronIcon } from '@/src/icons/base';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord';
import { Track, TrackStatus } from '@/src/lib/types/repertoire/track.types';
import { cn } from '@/src/utils/cn';
import { getTrackPerformers } from '@/src/utils/track-performers.utils';

import TrackPerformerNames from '../TrackPerformerNames';
import { ALL_BANDS_ROW_GRID, SPECIFIC_BAND_ROW_GRID } from '../tracks-table.const';

const STATUS_VARIANT: Record<
  TrackStatus,
  'stamp-ready' | 'stamp-learning' | 'stamp-new' | 'stamp-archived'
> = {
  ready: 'stamp-ready',
  learning: 'stamp-learning',
  new: 'stamp-new',
  archived: 'stamp-archived',
};

const STATUS_LABEL: Record<TrackStatus, string> = {
  ready: 'Ready',
  learning: 'Learning',
  new: 'New',
  archived: 'Archived',
};

export interface TrackListRowProps {
  index?: number;
  /** Whether this track belongs to current user — shows ★ and green highlight */
  isMyTrack?: boolean;
  track: Track;
}

export default function TrackListRow({ index = 0, isMyTrack = false, track }: TrackListRowProps) {
  const { getVinylColor, isSpecificBandSelected } = useActiveBand();
  const { user } = useAuth();
  const [isSelected, setIsSelected] = useState(false);

  const isArchived = track.status === 'archived';

  /** Current user first, then the rest — see getTrackPerformers */
  const performers = getTrackPerformers(track, user?.id);

  /** Accent stripe is shown for my tracks in a band view, and for every track in "all bands" view */
  const hasAccentBorder = (isMyTrack && isSpecificBandSelected) || !isSpecificBandSelected;

  /** Tracks without a band are solo — labelled as such instead of showing a blank cell */
  const bandName = track.band?.name ?? 'Solo';

  /** Border width is always reserved so selecting a row never shifts its content */
  const borderColor = isSelected
    ? 'border-l-accent-red dark:border-l-accent-red'
    : !hasAccentBorder
      ? 'border-l-transparent dark:border-l-transparent'
      : isArchived
        ? 'border-l-fg-tertiary dark:border-l-fg-tertiary'
        : 'border-l-emerald-main dark:border-l-emerald-main';

  return (
    <div
      className={cn('bg-base', {
        'bg-emerald-subtle-70': isSpecificBandSelected && isMyTrack && isArchived,
        'bg-emerald-subtle': isSpecificBandSelected && isMyTrack && !isArchived,
      })}
      role="row"
    >
      <div
        className={cn(
          'group border-border-primary dark:border-fg-primary/30 border-1.5 border-b',
          'pli-4 plb-3 cursor-pointer transition-colors duration-100',
          'border-l-3',
          borderColor,
          isSelected ? 'bg-elevated' : 'hover:bg-elevated',
          { 'bg-hatching': isArchived && !isSelected },
          isSpecificBandSelected ? SPECIFIC_BAND_ROW_GRID : ALL_BANDS_ROW_GRID,
        )}
        onClick={() => setIsSelected((prev) => !prev)}
      >
        {/* ★ indicator — only for my tracks */}
        <div role="cell" className="hidden items-center justify-center sm:flex">
          {isMyTrack ? (
            <StarOutlineIcon
              className={cn(isArchived ? 'text-fg-tertiary' : 'text-emerald-main')}
            />
          ) : null}
        </div>

        {/* Order number */}
        <span
          role="cell"
          className={cn(
            'text-center text-sm font-black tabular-nums',
            isArchived ? 'text-fg-tertiary' : 'text-emerald-main',
          )}
        >
          {index + 1}
        </span>

        {/* Title + meta — min-w-0 lets the children truncate inside the grid cell */}
        <div className="flex min-w-0 flex-col gap-1 sm:gap-0" role="cell">
          <div
            className={cn(
              'truncate text-sm leading-snug font-semibold',
              isArchived ? 'text-fg-tertiary line-through' : 'text-fg-primary',
            )}
          >
            {track.title}
          </div>

          {/* from sm screens */}
          <TrackPerformerNames
            className="text-fg-tertiary mbs-0.5 hidden text-xs sm:block"
            isMuted={isArchived}
            isTruncated
            performers={performers}
          />

          {/* up to sm screens */}
          <div className="text-fg-tertiary xs:flex-row xs:items-center mbs-0.5 flex flex-col items-start gap-1 text-xs sm:hidden">
            {!isSpecificBandSelected ? (
              <div className="flex items-center gap-1" role="cell">
                <VinylRecord color={getVinylColor(track.band?.id)} size={16} />
                <span className="text-fg-secondary text-sm tabular-nums">{bandName}</span>
                <span className="text-fg-tertiary xs:inline hidden">{' · '}</span>
              </div>
            ) : null}
            <Text className="text-fg-tertiary flex min-w-0 items-baseline" tag="span">
              {isSpecificBandSelected ? (
                <>
                  <TrackPerformerNames
                    className="max-w-40"
                    isMuted={isArchived}
                    isTruncated
                    performers={performers}
                  />
                  <span className="mie-1">{' ·'}</span>
                </>
              ) : null}
              <span className="whitespace-nowrap">
                {[track.musicalKey, track.bpm, track.duration].join(' · ')}
              </span>
            </Text>
          </div>
        </div>

        {/* Band  */}
        {!isSpecificBandSelected ? (
          <div className="hidden items-center gap-2 sm:flex" role="cell">
            <VinylRecord color={getVinylColor(track.band?.id)} size={16} />
            <span className="text-fg-secondary text-sm tabular-nums">{bandName}</span>
          </div>
        ) : null}

        {/* Musical key */}
        <span
          role="cell"
          className={cn(
            'hidden text-sm font-black tabular-nums sm:inline',
            isArchived ? 'text-fg-tertiary' : 'text-emerald-main',
          )}
        >
          {track.musicalKey}
        </span>

        {/* BPM */}
        <span
          role="cell"
          className={cn(
            'hidden text-sm tabular-nums sm:inline',
            isArchived ? 'text-fg-tertiary' : 'text-fg-secondary',
          )}
        >
          {track.bpm}
        </span>

        {/* Status badge */}
        <div role="cell">
          <Badge
            className={index % 2 === 0 ? '-rotate-3' : 'rotate-3'}
            variant={STATUS_VARIANT[track.status]}
            size="sm"
          >
            {STATUS_LABEL[track.status]}
          </Badge>
        </div>

        {/* Duration */}
        <span
          role="cell"
          className={cn(
            'hidden text-sm tabular-nums sm:inline',
            isArchived ? 'text-fg-tertiary' : 'text-fg-tertiary',
          )}
        >
          {track.duration}
        </span>

        {/* Navigate button — always visible */}
        <div role="cell" className="mis-3 sm:mis-0 flex items-center justify-end">
          <Link
            aria-label={`Open ${track.title}`}
            className="text-fg-tertiary hover:text-fg-primary hover:bg-edge rounded-lg p-1.5 transition-colors"
            href={`/repertoire/${track.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronIcon direction="right" size={16} strokeWidth="2" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
