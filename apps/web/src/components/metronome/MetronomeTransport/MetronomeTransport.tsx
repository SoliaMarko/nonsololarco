'use client';

import { useTranslations } from 'next-intl';

import { PauseIcon, PlayIcon, SaveIcon } from '@/src/icons/base';
import { ChooserSong } from '@/src/lib/types/metronome.types';
import { cn } from '@/src/utils/cn';

interface MetronomeTransportProps {
  onSave: () => void;
  onTogglePlay: () => void;
  playing: boolean;
  tracked: ChooserSong | 'skip' | null;
}

/**
 * Transport controls — a large circular play/pause button and, when a
 * song is being tracked and the metronome is playing, a "save session"
 * action.
 */
export default function MetronomeTransport({
  onSave,
  onTogglePlay,
  playing,
  tracked,
}: MetronomeTransportProps) {
  const t = useTranslations('pages.metronome');
  const isSong = tracked && tracked !== 'skip';

  return (
    <div className="flex items-center gap-4">
      <button
        aria-label={playing ? t('ariaPause') : t('ariaPlay')}
        className={cn(
          'border-primary-dark flex size-18 items-center justify-center rounded-full border-3',
          'shadow-[2px_2px_0_rgba(0,0,0,0.5)]',
          'transition-transform duration-100 hover:-translate-x-px hover:-translate-y-px',
          playing ? 'bg-accent-red' : 'bg-yellow-main',
        )}
        onClick={onTogglePlay}
        type="button"
      >
        {playing ? (
          <PauseIcon size={28} className="text-primary-dark" />
        ) : (
          // A right-pointing triangle carries its visual mass toward the
          // flat edge, so geometric centring reads as off-centre. Nudge it
          // right by ~8% of its width to centre it optically.
          <PlayIcon size={28} className="text-primary-dark translate-x-0.5" />
        )}
      </button>

      {isSong && playing && (
        <button
          className={cn(
            'pli-4 plb-3 border-emerald-main bg-emerald-main text-primary-light',
            'font-ui inline-flex items-center gap-1.75 border-2 text-[0.8125rem] font-semibold tracking-wider uppercase',
            'shadow-[2px_2px_0_rgba(0,0,0,0.5)]',
            'transition-transform duration-100 hover:-translate-x-px hover:-translate-y-px',
          )}
          onClick={onSave}
          type="button"
        >
          <SaveIcon size={15} />
          {t('finishAndSave')}
        </button>
      )}
    </div>
  );
}
