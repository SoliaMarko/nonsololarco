'use client';

import { useState } from 'react';

import { ArrowRightSolidIcon, PlayIcon, PlusSolidIcon, SearchOutlineIcon } from '@/src/icons/base';
import { MOCK_REPERTOIRE_SONGS } from '@/src/data/metronome/metronome.mock';
import { cn } from '@/src/utils/cn';

import { ChooserSong } from '@/src/lib/types/metronome.types';

const STATUS_LABEL: Record<string, string> = {
  archived: 'Архів',
  learning: 'Вчу',
  new: 'Нова',
  ready: 'Готова',
};

interface SongChooserProps {
  onAdd: () => void;
  onPick: (song: ChooserSong) => void;
  onSkip: () => void;
}

/**
 * Fullscreen overlay that asks "Що репетируєш?" — presents a searchable
 * song list, a "new song" action, and a "just play" (skip tracking) action.
 */
export default function SongChooser({ onAdd, onPick, onSkip }: SongChooserProps) {
  const [query, setQuery] = useState('');
  const filtered = MOCK_REPERTOIRE_SONGS.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      style={{
        background: 'rgba(20,16,11,0.86)',
        backdropFilter: 'blur(2px)',
        padding: '30px',
      }}
    >
      <div
        className="text-yellow-main"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '4px',
        }}
      >
        МЕТРОНОМ · ПЕРЕД СТАРТОМ
      </div>

      <div
        className="mbs-1.5 mbe-5 text-center text-primary-light"
        style={{
          fontFamily: "'Alfa Slab One', serif",
          fontSize: '30px',
        }}
      >
        Що репетируєш?
      </div>

      <div
        className="w-[440px] max-w-full border-[2.5px] border-primary-dark bg-surface"
        style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
      >
        {/* Search */}
        <div className="flex items-center gap-2 border-b-2 border-fg-primary bg-surface" style={{ padding: '10px 14px' }}>
          <SearchOutlineIcon size={15} className="text-fg-tertiary" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-fg-primary outline-none placeholder:text-fg-tertiary"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Знайти твір у репертуарі…"
            style={{ fontFamily: "'Spectral', serif", fontSize: '14px' }}
            value={query}
          />
        </div>

        {/* Song list */}
        <div className="max-h-[260px] overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s.number}
              className="flex w-full items-center gap-3 border-b border-edge bg-transparent text-start transition-colors duration-100 hover:bg-yellow-subtle"
              onClick={() => onPick(s)}
              style={{ padding: '10px 14px' }}
              type="button"
            >
              <span
                className="w-5 shrink-0 text-fg-tertiary"
                style={{ fontFamily: "'Alfa Slab One', serif", fontSize: '15px' }}
              >
                {s.number}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className="text-fg-primary"
                  style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '15px' }}
                >
                  {s.title}
                </div>
                <div
                  className="text-fg-tertiary"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}
                >
                  {s.key} · {s.bpm} BPM · {STATUS_LABEL[s.ready] ?? s.ready}
                </div>
              </div>
              <ArrowRightSolidIcon size={16} className="text-fg-tertiary" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div
              className="text-fg-tertiary"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '12px',
                padding: '10px 14px',
              }}
            >
              Не знайдено в репертуарі
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex border-t-2 border-fg-primary">
          <button
            className={cn(
              'flex flex-1 flex-col items-center gap-[5px] bg-surface text-center transition-colors duration-100 hover:bg-yellow-subtle',
              'border-ie-2 border-fg-primary',
            )}
            onClick={onAdd}
            style={{ padding: '14px 8px' }}
            type="button"
          >
            <PlusSolidIcon size={20} className="text-fg-primary" />
            <span
              className="text-fg-primary"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Новий твір
            </span>
            <span
              className="text-fg-tertiary"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', lineHeight: 1.4 }}
            >
              додати в репертуар
            </span>
          </button>

          <button
            className="flex flex-1 flex-col items-center gap-[5px] bg-surface text-center transition-colors duration-100 hover:bg-elevated"
            onClick={onSkip}
            style={{ padding: '14px 8px' }}
            type="button"
          >
            <PlayIcon size={20} className="text-fg-tertiary" />
            <span
              className="text-fg-tertiary"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Просто грати
            </span>
            <span
              className="text-fg-tertiary"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', lineHeight: 1.4 }}
            >
              без трекінгу історії
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
