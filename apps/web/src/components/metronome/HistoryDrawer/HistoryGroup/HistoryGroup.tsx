'use client';

import { ChevronIcon, MetronomeIcon, TrashIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

import { PracticeSession } from '@/src/lib/types/metronome.types';

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
 * Collapsible song group inside the history drawer — shows a mini vinyl
 * disc, the song name, session count, and best BPM. Expands to reveal
 * individual session rows with date, BPM, duration, and a delete button.
 */
export default function HistoryGroup({ group, onDelete, onToggle, open }: HistoryGroupProps) {
  const best = Math.max(...group.rows.map((r) => r.bpm));

  return (
    <div className="border-b-[1.5px] border-edge">
      {/* Song header */}
      <button
        className="flex w-full items-center gap-[11px] bg-transparent text-start hover:bg-yellow-subtle"
        onClick={onToggle}
        style={{ padding: '11px 18px 9px' }}
        type="button"
      >
        {/* Mini vinyl disc */}
        <span className="relative flex size-[30px] shrink-0 items-center justify-center rounded-full bg-fg-primary">
          <span className="size-[7px] rounded-full bg-surface" />
        </span>

        <div className="min-w-0 flex-1">
          <div
            className="text-fg-primary"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '15px', lineHeight: 1.05 }}
          >
            {group.song}
          </div>
          <div
            className="text-fg-tertiary"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}
          >
            {group.rows.length} сесій · до {best} BPM
          </div>
        </div>

        <span
          className="shrink-0 border-[1.5px] border-emerald-main bg-emerald-subtle text-emerald-deep"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
          }}
        >
          {group.rows.length}
        </span>

        <ChevronIcon
          size={15}
          className={cn(
            'shrink-0 text-fg-tertiary transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>

      {/* Expanded rows */}
      {open && (
        <div style={{ padding: '0 18px 10px' }}>
          {group.rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2.5 border-t border-edge"
              style={{ padding: '8px 0' }}
            >
              <span
                className="w-[58px] shrink-0 text-fg-secondary"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px' }}
              >
                {r.date}
              </span>
              <span
                className="inline-flex items-center gap-1 text-fg-primary"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px' }}
              >
                <MetronomeIcon size={11} className="text-fg-tertiary" />
                <b
                  className="text-emerald-deep"
                  style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '13px' }}
                >
                  {r.bpm}
                </b>
              </span>
              <span
                className="mli-auto text-fg-tertiary"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}
              >
                {r.duration}
              </span>
              <button
                aria-label="Видалити запис"
                className="flex size-[26px] shrink-0 items-center justify-center border-[1.5px] border-edge bg-surface text-fg-tertiary transition-all duration-100 hover:border-danger-deep hover:bg-danger-subtle hover:text-danger-deep"
                onClick={() => onDelete(r)}
                type="button"
              >
                <TrashIcon size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
