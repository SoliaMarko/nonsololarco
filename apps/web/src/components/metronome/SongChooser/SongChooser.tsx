'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowRightSolidIcon, PlayIcon, PlusSolidIcon, SearchOutlineIcon } from '@/src/icons/base';
import { ChooserSong, TimeSignatureDef } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';

import TimeSignatureSelect from '../TimeSignatureSelect';

const STATUS_LABEL: Record<string, string> = {
  archived: 'Архів',
  learning: 'Вчу',
  new: 'Нова',
  ready: 'Готова',
};

/** Shared styling for the two footer actions, which sit side by side. */
const FOOTER_ACTION =
  'pli-2 plb-4 flex flex-1 flex-col items-center justify-center gap-1 bg-surface text-center transition-colors duration-100';

const FOOTER_CAPTION = 'font-label text-fg-tertiary text-[0.5625rem] leading-snug';

const FOOTER_TITLE = 'font-ui text-[0.8125rem] font-semibold tracking-wide uppercase';

interface SongChooserProps {
  onAdd: (title: string, bpm?: number, signature?: TimeSignatureDef) => void;
  /**
   * Closes the overlay leaving the session untouched. Omit it when there is
   * nothing to go back to — on first open there's no previous selection, so
   * dismissing would strand the user on an empty metronome.
   */
  onDismiss?: () => void;
  onPick: (song: ChooserSong) => void;
  onSkip: () => void;
  songs: ChooserSong[];
}

/**
 * Fullscreen overlay that asks "Що репетируєш?" — presents a searchable
 * song list, an inline "new song" form, and a "just play" (skip tracking)
 * action. When `onDismiss` is provided, clicking the backdrop or pressing
 * Escape closes it without changing the current song or tempo.
 */
export default function SongChooser({ onAdd, onDismiss, onPick, onSkip, songs }: SongChooserProps) {
  const [query, setQuery] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBpm, setNewBpm] = useState('');
  const [sigNum, setSigNum] = useState(4);
  const [sigDenom, setSigDenom] = useState(4);
  const cardRef = useRef<HTMLDivElement>(null);

  const filtered = songs.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));

  const handleSubmitNew = () => {
    const title = newTitle.trim();
    if (!title) return;
    const bpm = newBpm.trim() ? parseInt(newBpm, 10) : undefined;
    const sig: TimeSignatureDef = { beats: sigNum, label: `${sigNum}/${sigDenom}` };
    onAdd(title, bpm && !Number.isNaN(bpm) ? bpm : undefined, sig);
    setNewTitle('');
    setNewBpm('');
    setSigNum(4);
    setSigDenom(4);
    setAddMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitNew();
    if (e.key === 'Escape') setAddMode(false);
  };

  // Escape closes the overlay, but only once the inline form is out of the
  // way — there it means "cancel the form", handled by handleKeyDown.
  useEffect(() => {
    if (!onDismiss || addMode) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [addMode, onDismiss]);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[rgba(20,16,11,0.86)] p-7.5 backdrop-blur-[2px]"
      // Anything outside the card counts as backdrop, including the headings.
      onClick={
        onDismiss
          ? (e) => {
              if (!cardRef.current?.contains(e.target as Node)) onDismiss();
            }
          : undefined
      }
    >
      <div className="font-label text-yellow-main text-[0.6875rem] tracking-[0.25rem]">
        МЕТРОНОМ · ПЕРЕД СТАРТОМ
      </div>

      <div className="font-display text-primary-light mbs-2 mbe-6 text-center text-3xl">
        Що репетируєш?
      </div>

      <div
        ref={cardRef}
        className="border-primary-dark bg-surface w-110 max-w-full border-[2.5px] shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
      >
        {/* Search */}
        <div className="pli-4 plb-3 border-fg-primary bg-surface flex items-center gap-2 border-be-2">
          <SearchOutlineIcon size={15} className="text-fg-tertiary" />
          <input
            className="font-prose text-fg-primary placeholder:text-fg-tertiary min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Знайти твір у репертуарі…"
            value={query}
          />
        </div>

        {/* Song list */}
        <div className="max-h-65 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s.number}
              className="pli-4 plb-3 border-edge hover:bg-elevated flex w-full items-center gap-3 border-be bg-transparent text-start transition-colors duration-100"
              onClick={() => onPick(s)}
              type="button"
            >
              <span className="font-display text-fg-tertiary w-5 shrink-0 text-[0.9375rem]">
                {s.number}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-ui text-fg-primary text-[0.9375rem] font-semibold">
                  {s.title}
                </div>
                <div className="font-label text-fg-tertiary text-[0.625rem]">
                  {s.key} · {s.bpm} BPM · {STATUS_LABEL[s.ready] ?? s.ready}
                </div>
              </div>
              <ArrowRightSolidIcon size={16} className="text-fg-tertiary" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="pli-4 plb-3 font-label text-fg-tertiary text-xs">
              Не знайдено в репертуарі
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-fg-primary flex border-bs-2">
          {addMode ? (
            <div className="pli-4 plb-3 border-ie-2 border-fg-primary bg-surface flex flex-1 flex-col gap-2">
              <div className="relative">
                <input
                  autoFocus
                  className="font-ui border-edge text-fg-primary placeholder:text-fg-tertiary w-full border-be bg-transparent pbe-1 text-sm outline-none"
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Назва твору…"
                  value={newTitle}
                />
                <span className="font-label text-accent-red absolute inset-e-0 top-0 text-sm">
                  *
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  className="font-label border-edge text-fg-primary placeholder:text-fg-tertiary w-20 border-be bg-transparent pbe-1 text-xs outline-none"
                  onChange={(e) => setNewBpm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="BPM"
                  type="number"
                  value={newBpm}
                />
                <TimeSignatureSelect
                  denominator={sigDenom}
                  numerator={sigNum}
                  onChange={(n, d) => {
                    setSigNum(n);
                    setSigDenom(d);
                  }}
                  showLabels
                  variant="light"
                />
              </div>

              <div className="flex gap-2">
                <button
                  className={cn(
                    'pli-3 plb-2 bg-emerald-main text-primary-light font-ui flex-1 text-xs font-semibold tracking-wide uppercase',
                    'transition-opacity duration-100',
                    !newTitle.trim() && 'opacity-40',
                  )}
                  disabled={!newTitle.trim()}
                  onClick={handleSubmitNew}
                  type="button"
                >
                  Додати і грати
                </button>
                <button
                  className="pli-3 plb-2 font-label text-fg-tertiary hover:text-fg-secondary border-0 bg-transparent text-[0.6875rem] transition-colors duration-100"
                  onClick={() => setAddMode(false)}
                  type="button"
                >
                  Скасувати
                </button>
              </div>
            </div>
          ) : (
            <button
              className={cn(FOOTER_ACTION, 'border-ie-2 border-fg-primary hover:bg-elevated')}
              onClick={() => setAddMode(true)}
              type="button"
            >
              <PlusSolidIcon size={20} className="text-fg-primary" />
              <span className={cn(FOOTER_TITLE, 'text-fg-primary')}>Новий твір</span>
              <span className={FOOTER_CAPTION}>додати в репертуар</span>
            </button>
          )}

          <button className={cn(FOOTER_ACTION, 'hover:bg-elevated')} onClick={onSkip} type="button">
            <PlayIcon size={20} className="text-fg-tertiary" />
            <span className={cn(FOOTER_TITLE, 'text-fg-tertiary')}>Просто грати</span>
            <span className={FOOTER_CAPTION}>без трекінгу історії</span>
          </button>
        </div>
      </div>
    </div>
  );
}
