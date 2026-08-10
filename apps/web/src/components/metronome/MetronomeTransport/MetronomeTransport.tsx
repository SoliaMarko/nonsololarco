'use client';

import { PauseIcon, PlayIcon, SaveIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

import { ChooserSong } from '@/src/lib/types/metronome.types';

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
  const isSong = tracked && tracked !== 'skip';

  return (
    <div className="flex items-center gap-4">
      <button
        aria-label={playing ? 'Пауза' : 'Старт'}
        className={cn(
          'flex size-[72px] items-center justify-center rounded-full border-3 border-primary-dark transition-transform duration-100 hover:-translate-x-px hover:-translate-y-px',
          playing ? 'bg-accent-red' : 'bg-yellow-main',
        )}
        onClick={onTogglePlay}
        style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}
        type="button"
      >
        {playing ? (
          <PauseIcon size={28} className="text-primary-dark" />
        ) : (
          <PlayIcon size={28} className="text-primary-dark" />
        )}
      </button>

      {isSong && playing && (
        <button
          className="inline-flex items-center gap-[7px] border-2 border-emerald-main bg-emerald-main text-primary-light hover:-translate-x-px hover:-translate-y-px"
          onClick={onSave}
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '11px 18px',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.5)',
          }}
          type="button"
        >
          <SaveIcon size={15} />
          Завершити та зберегти
        </button>
      )}
    </div>
  );
}
