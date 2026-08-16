'use client';

import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  ArrowLeftSolidIcon,
  ArrowRightSolidIcon,
  PlayIcon,
  PlusSolidIcon,
  SearchOutlineIcon,
} from '@/src/icons/base';
import { ChooserSong, TimeSignatureDef } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';
import { MT_MAX, MT_MIN } from '@/src/utils/metronome.utils';

import TimeSignatureSelect from '../TimeSignatureSelect';

const STATUS_KEY: Record<string, string> = {
  archived: 'statusArchived',
  learning: 'statusLearning',
  new: 'statusNew',
  ready: 'statusReady',
};

/** Shared styling for the two footer actions, which sit side by side. */
const FOOTER_ACTION =
  'pli-2 plb-4 flex flex-1 flex-col items-center justify-center gap-1 bg-surface text-center transition-colors duration-100';

const FOOTER_CAPTION = 'font-label text-fg-tertiary text-[0.5625rem] leading-snug';

const FOOTER_TITLE = 'font-ui text-[0.8125rem] font-semibold tracking-wide uppercase';

interface SongChooserProps {
  onAdd: (title: string, bpm?: number, signature?: TimeSignatureDef) => void;
  /**
   * Leaves the metronome entirely (back to the app). Rendered as the
   * top-left back arrow. Distinct from `onDismiss`: back exits the feature,
   * dismiss just closes this overlay onto the running metronome.
   */
  onBack: () => void;
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
 * Fullscreen overlay that asks what the user is practising — presents a searchable
 * song list, an inline "new song" form, and a "just play" (skip tracking)
 * action. When `onDismiss` is provided, clicking the backdrop or pressing
 * Escape closes it without changing the current song or tempo.
 */
export default function SongChooser({
  onAdd,
  onBack,
  onDismiss,
  onPick,
  onSkip,
  songs,
}: SongChooserProps) {
  const t = useTranslations('pages.metronome');
  const tStatus = useTranslations('pages.repertoire');
  const [query, setQuery] = useState('');
  const [addMode, setAddMode] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBpm, setNewBpm] = useState('');
  const [bpmError, setBpmError] = useState(false);
  const [sigNum, setSigNum] = useState(4);
  const [sigDenom, setSigDenom] = useState(4);
  const cardRef = useRef<HTMLDivElement>(null);

  const filtered = songs.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));

  /**
   * Validates the inline "new song" form and forwards it to `onAdd`.
   *
   * A blank title is a silent no-op — the submit button is disabled in that
   * state, this just guards the Enter key. BPM is optional: an empty field
   * passes `undefined` so the caller keeps the current tempo. When present it
   * must be a positive integer; zero, negatives and non-numeric input are
   * rejected (surfaced via `bpmError`) rather than reaching playback state,
   * since `MetronomeScreen` feeds this value straight into `setBpm`.
   */
  const handleSubmitNew = () => {
    const title = newTitle.trim();
    if (!title) return;

    const raw = newBpm.trim();
    const parsed = raw ? Number(raw) : undefined;
    if (parsed !== undefined && (!Number.isInteger(parsed) || parsed < MT_MIN || parsed > MT_MAX)) {
      setBpmError(true);
      return;
    }

    const sig: TimeSignatureDef = { beats: sigNum, label: `${sigNum}/${sigDenom}` };
    onAdd(title, parsed, sig);
    setNewTitle('');
    setNewBpm('');
    setBpmError(false);
    setSigNum(4);
    setSigDenom(4);
    setAddMode(false);
  };

  /**
   * Abandons the inline "new song" form and discards the draft: clears the
   * title, BPM and validation error and restores the 4/4 default. Without the
   * reset a cancelled entry would reappear the next time the form is opened.
   */
  const handleCancelNew = () => {
    setNewTitle('');
    setNewBpm('');
    setBpmError(false);
    setSigNum(4);
    setSigDenom(4);
    setAddMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitNew();
  };

  // A single Escape handler covers both modes: in add mode it cancels the
  // form (regardless of which control has focus), otherwise it dismisses
  // the overlay. Attaching at the document level ensures it works even when
  // focus is on the time-signature selector or the Cancel button.
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (addMode) {
        handleCancelNew();
      } else if (onDismiss) {
        onDismiss();
      }
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
      <button
        aria-label="Exit metronome"
        className="border-primary-light/30 bg-primary-light/5 text-primary-light hover:bg-primary-light/[.12] block-start-5 absolute inset-s-5 flex size-9 items-center justify-center border-2 transition-[background-color] duration-100"
        // Stop the click reaching the backdrop handler, which would otherwise
        // also fire onDismiss on the way up.
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
        type="button"
      >
        <ArrowLeftSolidIcon size={18} />
      </button>

      <div className="font-label text-yellow-main text-[0.6875rem] tracking-[0.25rem]">
        {t('beforeStart')}
      </div>

      <div className="font-display text-primary-light mbs-2 mbe-6 text-center text-3xl">
        {t('chooserTitle')}
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
            placeholder={t('searchPlaceholder')}
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
                  {s.key} · {s.bpm} BPM · {tStatus(STATUS_KEY[s.ready] ?? 'statusNew')}
                </div>
              </div>
              <ArrowRightSolidIcon size={16} className="text-fg-tertiary" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="pli-4 plb-3 font-label text-fg-tertiary text-xs">{t('notFound')}</div>
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
                  placeholder={t('newTitlePlaceholder')}
                  value={newTitle}
                />
                <span className="font-label text-accent-red absolute inset-e-0 top-0 text-sm">
                  *
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  aria-invalid={bpmError}
                  className={cn(
                    'font-label border-edge text-fg-primary placeholder:text-fg-tertiary w-20 border-be bg-transparent pbe-1 text-xs outline-none',
                    bpmError && 'border-accent-red',
                  )}
                  onChange={(e) => {
                    setNewBpm(e.target.value);
                    setBpmError(false);
                  }}
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

              {bpmError && (
                <div className="font-label text-accent-red text-[0.625rem]" role="alert">
                  {t('bpmError')}
                </div>
              )}

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
                  {t('addAndPlay')}
                </button>
                <button
                  className="pli-3 plb-2 font-label text-fg-tertiary hover:text-fg-secondary border-0 bg-transparent text-[0.6875rem] transition-colors duration-100"
                  onClick={handleCancelNew}
                  type="button"
                >
                  {t('cancel')}
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
              <span className={cn(FOOTER_TITLE, 'text-fg-primary')}>{t('newTrack')}</span>
              <span className={FOOTER_CAPTION}>{t('addToRepertoire')}</span>
            </button>
          )}

          <button className={cn(FOOTER_ACTION, 'hover:bg-elevated')} onClick={onSkip} type="button">
            <PlayIcon size={20} className="text-fg-tertiary" />
            <span className={cn(FOOTER_TITLE, 'text-fg-tertiary')}>{t('justPlay')}</span>
            <span className={FOOTER_CAPTION}>{t('justPlayCaption')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
