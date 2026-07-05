import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Band } from '@nonsololarco/types';

import Text from '@/src/components/typography/Text';
import Badge from '@/src/components/ui/Badge';
import { StarOutlineIcon } from '@/src/icons/achievements';
import { ChevronIcon } from '@/src/icons/base';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord';
import { Track, TrackStatus } from '@/src/lib/types/repertoire/track.types';
import { cn } from '@/src/lib/ui/utils/cn';

import { ALL_BANDS_ROW_GRID, SPECIFIC_BAND_ROW_GRID } from '../TracksTable';

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
  bands: Band[];
  index?: number;
  /** Whether this track belongs to current user — shows ★ and green highlight */
  isMyTrack?: boolean;
  track: Track;
}

export default function TrackListRow({
  bands,
  index = 0,
  isMyTrack = false,
  track,
}: TrackListRowProps) {
  const searchParams = useSearchParams();

  const activeBandId = searchParams.get('band') ?? '';
  const isSpecificBandSelected = Boolean(activeBandId);

  const isArchived = track.status === 'archived';

  return (
    <div
      className={cn('bg-base', {
        'bg-emerald-subtle-70': isSpecificBandSelected && isMyTrack && isArchived,
        'bg-emerald-subtle': isSpecificBandSelected && isMyTrack && !isArchived,
      })}
      role="row"
    >
      <Link
        className={cn(
          'group border-border-primary hover:bg-elevated border-l-emerald-main border-b',
          'pli-4 plb-3 transition-colors duration-100',
          {
            'hover:bg-emerald-subtle-hover border-l-3': isMyTrack && isSpecificBandSelected,
            'border-l-3': !isSpecificBandSelected,
            'bg-hatching border-l-fg-tertiary': isArchived,
          },
          isSpecificBandSelected ? SPECIFIC_BAND_ROW_GRID : ALL_BANDS_ROW_GRID,
        )}
        href={`/repertoire/${track.id}`}
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
          {isSpecificBandSelected ? track.order : index + 1}
        </span>

        {/* Title + meta */}
        <div className="flex flex-col gap-1 sm:gap-0" role="cell">
          <div
            className={cn(
              'text-sm leading-snug font-semibold',
              isArchived ? 'text-fg-tertiary line-through' : 'text-fg-primary',
            )}
          >
            {track.title}
          </div>

          {/* from sm screens */}
          <div className="text-fg-tertiary mbs-0.5 hidden text-xs sm:block">
            {track.leadMember.name}
          </div>

          {/* up to sm screens */}
          <div className="text-fg-tertiary xs:flex-row xs:items-center mbs-0.5 flex flex-col items-start gap-1 text-xs sm:hidden">
            {!isSpecificBandSelected ? (
              <div className="flex items-center gap-1" role="cell">
                <VinylRecord size={16} />
                <span className="text-fg-secondary text-sm tabular-nums">{track.band?.name}</span>
                <span className="text-fg-tertiary xs:inline hidden">{' · '}</span>
              </div>
            ) : null}
            <Text className="text-fg-tertiary">
              {[
                isSpecificBandSelected ? track.leadMember.name : null,
                track.musicalKey,
                track.bpm,
                track.duration,
              ]
                .filter((item) => item)
                .join(' · ')}
            </Text>
          </div>
        </div>

        {/* Band  */}
        {!isSpecificBandSelected ? (
          <div className="hidden items-center gap-2 sm:flex" role="cell">
            <VinylRecord size={16} />
            <span className="text-fg-secondary text-sm tabular-nums">{track.band?.name}</span>
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

        <div
          role="cell"
          className={cn(
            'text-fg-tertiary flex items-center justify-end gap-1 transition-opacity',
            'group-hover:opacity-100 sm:opacity-0',
          )}
        >
          <ChevronIcon direction="right" size={12} aria-hidden="true" />
        </div>
      </Link>
    </div>
  );
}
