'use client';

import { EyeOffIcon, VinylIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

import { ChooserSong } from '@/src/lib/types/metronome.types';

interface TrackBadgeProps {
  onChangeTrack: () => void;
  tracked: ChooserSong | 'skip' | null;
}

const ACTION_CLASS =
  'font-label mis-1 border-0 bg-transparent text-[0.625rem] text-current underline underline-offset-2 opacity-80 transition-opacity duration-100 hover:opacity-100';

/**
 * Badge that shows which song is being tracked during the metronome session
 * (emerald border for a linked song, muted border for "no tracking").
 */
export default function TrackBadge({ onChangeTrack, tracked }: TrackBadgeProps) {
  const isSong = tracked && tracked !== 'skip';

  return (
    <div
      className={cn(
        'pli-3 plb-2 font-label inline-flex items-center gap-2 border-[1.5px] text-xs',
        isSong
          ? 'border-emerald-main bg-emerald-main/20 text-emerald-light'
          : 'border-primary-light/30 bg-primary-light/5 text-primary-light/60',
      )}
    >
      {isSong ? (
        <>
          <VinylIcon size={14} />
          Трекається у <b className="text-primary-light">{tracked.title}</b>
          <button className={ACTION_CLASS} onClick={onChangeTrack} type="button">
            змінити
          </button>
        </>
      ) : (
        <>
          <EyeOffIcon size={14} />
          Без трекінгу
          <button className={ACTION_CLASS} onClick={onChangeTrack} type="button">
            обрати твір
          </button>
        </>
      )}
    </div>
  );
}
