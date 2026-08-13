'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ChevronIcon, MetronomeIcon, TrashIcon } from '@/src/icons/base';
import VinylRecord from '@/src/illustrations/vinyl/VinylRecord';
import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { PracticeSession } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';

interface HistoryGroupData {
  rows: PracticeSession[];
  song: string;
  songNumber: number;
}

interface HistoryGroupProps {
  group: HistoryGroupData;
  onDelete: (entry: PracticeSession) => void;
  onToggle: () => void;
  open: boolean;
}

/**
 * Collapsible song group inside the history drawer — shows the song's
 * `VinylRecord`, its name, session count, and best BPM. Expands to reveal
 * individual session rows with date, BPM, duration, and a delete button.
 *
 * Dates and durations are rendered through next-intl (`useFormatter` and the
 * `metronome.duration*` messages) so they follow the active locale rather
 * than a hardcoded language.
 */
export default function HistoryGroup({ group, onDelete, onToggle, open }: HistoryGroupProps) {
  const t = useTranslations('pages.metronome');
  const format = useFormatter();
  const best = Math.max(...group.rows.map((r) => r.bpm));

  // Keyed off the song number so a song always shows the same colour, rather
  // than reshuffling whenever the list is re-sorted or an entry is deleted.
  const discColor = VINYL_COLORS[group.songNumber % VINYL_COLORS.length] ?? 'olive';

  return (
    <div className="border-edge border-b-[1.5px]">
      {/* Song header */}
      <button
        className="pli-4 plb-3 hover:bg-elevated flex w-full items-center gap-3 bg-transparent text-start transition-colors duration-100"
        onClick={onToggle}
        type="button"
      >
        <VinylRecord color={discColor} size={30} />
        <div className="min-w-0 flex-1">
          <div className="font-ui text-fg-primary text-[0.9375rem] leading-[1.05] font-semibold">
            {group.song}
          </div>
          <div className="font-label text-fg-tertiary text-[0.625rem]">
            {t('groupSummary', { best, count: group.rows.length })}
          </div>
        </div>

        <span className="pli-2 font-label border-emerald-main bg-emerald-subtle text-emerald-deep dark:text-emerald-light shrink-0 border-[1.5px] text-[0.6875rem] font-bold">
          {group.rows.length}
        </span>

        <ChevronIcon
          size={15}
          className={cn(
            'text-fg-tertiary shrink-0 transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>

      {/* Expanded rows */}
      {open && (
        <div className="pli-4 pbe-2">
          {group.rows.map((r) => {
            const minutes = Math.round(r.durationMs / 60000);

            return (
              <div key={r.id} className="plb-2 border-edge flex items-center gap-2.5 border-t">
                <span className="font-label text-fg-secondary w-14.5 shrink-0 text-[0.6875rem]">
                  {format.dateTime(new Date(r.startedAt), { day: 'numeric', month: 'short' })}
                </span>
                <span className="font-label text-fg-primary inline-flex items-center gap-1 text-[0.6875rem]">
                  <MetronomeIcon size={11} className="text-fg-tertiary" />
                  <b className="font-display text-emerald-deep text-[0.8125rem]">{r.bpm}</b>
                </span>
                <span className="font-label mli-auto text-fg-tertiary text-[0.625rem]">
                  {minutes < 1 ? t('durationUnderMin') : t('durationMin', { minutes })}
                </span>
                <button
                  aria-label="Delete entry"
                  className="border-edge bg-surface text-fg-tertiary hover:border-danger-deep hover:bg-danger-subtle hover:text-danger-deep flex size-6.5 shrink-0 items-center justify-center border-[1.5px] transition-[background-color,border-color,color] duration-100"
                  onClick={() => onDelete(r)}
                  type="button"
                >
                  <TrashIcon size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
