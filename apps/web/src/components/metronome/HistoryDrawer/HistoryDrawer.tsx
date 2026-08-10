'use client';

import { useMemo, useState } from 'react';

import { MetronomeIcon } from '@/src/icons/base';

import { PracticeSession } from '@/src/lib/types/metronome.types';

import HistoryGroup from './HistoryGroup';

interface HistoryDrawerProps {
  history: PracticeSession[];
  onClose: () => void;
  onDelete: (id: string, restore?: PracticeSession) => void;
}

/**
 * Slide-in drawer showing aggregated practice stats and a grouped song
 * history. Each song can be expanded to see individual sessions. Deleted
 * entries show a 4-second undo bar at the bottom.
 */
export default function HistoryDrawer({ history, onClose, onDelete }: HistoryDrawerProps) {
  const [openSong, setOpenSong] = useState<string | null>(null);
  const [undoEntry, setUndoEntry] = useState<PracticeSession | null>(null);

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
    return Object.values(map);
  }, [history]);

  const totalMin = history.reduce((a, h) => a + parseInt(h.duration), 0);

  const handleDelete = (entry: PracticeSession) => {
    onDelete(entry.id);
    setUndoEntry(entry);
    setTimeout(() => setUndoEntry((u) => (u && u.id === entry.id ? null : u)), 4000);
  };

  const handleUndo = () => {
    if (!undoEntry) return;
    onDelete('', undoEntry);
    setUndoEntry(null);
  };

  return (
    <>
      {/* Scrim */}
      <div
        className="absolute inset-0 z-35"
        onClick={onClose}
        style={{
          background: 'rgba(20,16,11,0.6)',
          backdropFilter: 'blur(1.5px)',
          animation: 'mt-toast-in 0.2s ease-out',
        }}
      />

      {/* Drawer */}
      <div
        className="absolute inset-y-0 start-0 z-36 flex max-w-[86%] flex-col border-ie-[2.5px] border-primary-dark bg-surface text-fg-primary"
        style={{
          width: '340px',
          boxShadow: '6px 0 0 rgba(0,0,0,0.35)',
          animation: 'mt-drawer-in 0.24s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-end justify-between border-b-[2.5px] border-fg-primary bg-fg-primary text-primary-light"
          style={{ padding: '18px 20px 14px' }}
        >
          <div>
            <div
              className="text-yellow-main"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '3px',
              }}
            >
              ЖУРНАЛ МЕТРОНОМА
            </div>
            <h2
              style={{
                fontFamily: "'Alfa Slab One', serif",
                fontSize: '24px',
                lineHeight: 0.95,
                marginTop: '4px',
              }}
            >
              Історія практик
            </h2>
          </div>
          <button
            aria-label="Закрити"
            className="border-0 bg-transparent text-primary-light opacity-70 hover:opacity-100"
            onClick={onClose}
            style={{ fontSize: '18px' }}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="flex border-b-2 border-edge">
          {[
            { label: 'ТВОРІВ', value: groups.length },
            { label: 'СЕСІЙ', value: history.length },
            { label: 'ХВИЛИН', value: totalMin },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 text-center ${i > 0 ? 'border-is-[1.5px] border-edge' : ''}`}
              style={{ padding: '12px 14px' }}
            >
              <div
                className="text-fg-primary"
                style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '22px', lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <div
                className="mbs-1 text-fg-tertiary"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '1px' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0 16px' }}>
          {groups.length === 0 ? (
            <div className="text-center text-fg-tertiary" style={{ padding: '40px 24px' }}>
              <MetronomeIcon size={40} />
              <div
                className="mbs-3 text-fg-secondary"
                style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '18px' }}
              >
                Поки порожньо
              </div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  lineHeight: 1.6,
                  marginTop: '6px',
                }}
              >
                Обери твір при старті метронома —
                <br />і сесії з&apos;являться тут.
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

        {/* Undo bar */}
        {undoEntry && (
          <div
            className="flex items-center justify-between gap-2.5 bg-fg-primary text-primary-light"
            style={{ padding: '9px 18px' }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
              Запис видалено · {undoEntry.song}
            </span>
            <button
              className="border-0 bg-transparent text-yellow-main"
              onClick={handleUndo}
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              type="button"
            >
              Повернути
            </button>
          </div>
        )}
      </div>
    </>
  );
}
