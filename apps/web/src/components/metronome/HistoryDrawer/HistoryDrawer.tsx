'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { HomeOutlineIcon, MetronomeIcon } from '@/src/icons/base';
import { PracticeSession } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';
import { byNewestFirst } from '@/src/utils/metronome.utils';

import HistoryGroup from './HistoryGroup';

interface HistoryDrawerProps {
  history: PracticeSession[];
  onClose: () => void;
  onDelete: (id: string, restore?: PracticeSession) => void;
  /** Leaves the metronome and returns to the rest of the app. */
  onExit: () => void;
}

/**
 * Slide-in drawer showing aggregated practice stats and a grouped song
 * history. Each song can be expanded to see individual sessions. Deleted
 * entries show a 4-second undo bar at the bottom, and a pinned footer
 * action exits the metronome back to the app.
 */
export default function HistoryDrawer({ history, onClose, onDelete, onExit }: HistoryDrawerProps) {
  const t = useTranslations('pages.metronome');
  const [openSong, setOpenSong] = useState<string | null>(null);
  const [undoEntry, setUndoEntry] = useState<PracticeSession | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  // Newest first, both within each song and across songs — the most recent
  // practice is what you look for when you open the log.
  const groups = useMemo(() => {
    const map: Record<string, { rows: PracticeSession[]; song: string; songNumber: number }> = {};
    history.forEach((h) => {
      const existing = map[h.song];
      if (existing) {
        existing.rows.push(h);
      } else {
        map[h.song] = { rows: [h], song: h.song, songNumber: h.songNumber };
      }
    });

    return Object.values(map)
      .map((group) => ({ ...group, rows: group.rows.slice().sort(byNewestFirst) }))
      .sort((a, b) => byNewestFirst(a.rows[0]!, b.rows[0]!));
  }, [history]);

  // Sum the numeric durationMs and convert to whole minutes once at the end,
  // rather than parsing the rendered duration labels: those are localized and
  // sub-minute sessions collapse to a "< 1 min" string that cannot round-trip.
  const totalMin = Math.round(history.reduce((a, h) => a + h.durationMs, 0) / 60000);

  const handleDelete = (entry: PracticeSession) => {
    onDelete(entry.id);
    setUndoEntry(entry);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(
      () => setUndoEntry((u) => (u && u.id === entry.id ? null : u)),
      4000,
    );
  };

  const handleUndo = () => {
    if (!undoEntry) return;
    onDelete('', undoEntry);
    setUndoEntry(null);
  };

  const stats = [
    { label: t('statTracks'), value: groups.length },
    { label: t('statSessions'), value: history.length },
    { label: t('statMinutes'), value: totalMin },
  ];

  return (
    <>
      {/* Scrim */}
      <div
        className="absolute inset-0 z-35 bg-[rgba(20,16,11,0.6)] backdrop-blur-[1.5px]"
        onClick={onClose}
        style={{ animation: 'toast-in 0.2s ease-out' }}
      />

      {/* Drawer */}
      <div
        className="border-ie-[2.5px] border-primary-dark bg-surface text-fg-primary absolute inset-y-0 inset-s-0 z-36 flex w-85 max-w-[86%] flex-col shadow-[6px_0_0_rgba(0,0,0,0.35)]"
        style={{ animation: 'mt-drawer-in 0.24s ease-out' }}
      >
        {/* Header — an inverted banner. It must pair `bg-contrast` with
            `text-on-contrast`; using `text-primary-light` here renders
            invisible in dark mode, where that token and `fg-primary`
            resolve to the same cream. */}
        <div className="pli-4 plb-4 border-fg-primary bg-contrast text-on-contrast flex items-end justify-between border-b-[2.5px]">
          <div>
            <div className="font-label text-banner-label dark:text-danger text-[0.625rem] tracking-[0.1875rem]">
              {t('journalLabel')}
            </div>
            <h2 className="font-display mbs-1 text-2xl leading-[0.95]">{t('journalTitle')}</h2>
          </div>
          <button
            aria-label="Close"
            className="border-0 bg-transparent text-lg text-current opacity-70 transition-opacity duration-100 hover:opacity-100"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="border-edge flex border-b-2">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                'pli-3 plb-3 flex-1 text-center',
                i > 0 && 'border-is-[1.5px] border-edge',
              )}
            >
              <div className="font-display text-fg-primary text-[1.375rem] leading-none">
                {stat.value}
              </div>
              <div className="font-label text-fg-tertiary mbs-1 text-[0.5625rem] tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* History list */}
        <div className="plb-2 flex-1 overflow-y-auto">
          {groups.length === 0 ? (
            <div className="pli-6 plb-8 text-fg-tertiary text-center">
              <MetronomeIcon size={40} />
              <div className="font-display text-fg-secondary mbs-3 text-lg">{t('emptyTitle')}</div>
              <div className="font-label mbs-2 text-[0.6875rem] leading-relaxed">
                {t('emptyBody')}
              </div>
            </div>
          ) : (
            groups.map((g) => (
              <HistoryGroup
                key={g.song}
                group={g}
                onDelete={handleDelete}
                onToggle={() => setOpenSong(openSong === g.song ? null : g.song)}
                open={openSong === g.song}
              />
            ))
          )}
        </div>

        {/* Exit to the rest of the app */}
        <button
          className="pli-4 plb-3 border-fg-primary bg-surface text-fg-primary hover:bg-elevated flex w-full items-center gap-2 border-t-2 text-start transition-colors duration-100"
          onClick={onExit}
          type="button"
        >
          <HomeOutlineIcon size={17} />
          <span className="font-ui text-[0.8125rem] font-semibold tracking-wide uppercase">
            {t('exit')}
          </span>
        </button>

        {/* Undo bar */}
        {undoEntry && (
          <div className="pli-4 plb-2 bg-contrast text-on-contrast flex items-center justify-between gap-2">
            <span className="font-label text-[0.6875rem]">{t('entryDeleted', { song: undoEntry.song })}</span>
            <button
              className="font-ui border-0 bg-transparent text-xs font-semibold tracking-wider text-current uppercase underline underline-offset-2 opacity-80 transition-opacity duration-100 hover:opacity-100"
              onClick={handleUndo}
              type="button"
            >
              {t('undo')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
