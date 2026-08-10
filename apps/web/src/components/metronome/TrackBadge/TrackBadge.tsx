'use client';

import { EyeOffIcon, VinylIcon } from '@/src/icons/base';
import { cn } from '@/src/utils/cn';

import { ChooserSong } from '@/src/lib/types/metronome.types';

interface TrackBadgeProps {
  onChangeTrack: () => void;
  tracked: ChooserSong | 'skip' | null;
}

/**
 * Badge that shows which song is being tracked during the metronome session
 * (emerald border for a linked song, muted border for "no tracking").
 */
export default function TrackBadge({ onChangeTrack, tracked }: TrackBadgeProps) {
  const isSong = tracked && tracked !== 'skip';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-[9px] border-[1.5px]',
        isSong
          ? 'border-emerald-main bg-emerald-main/20 text-emerald-light'
          : 'border-primary-light/30 bg-primary-light/5 text-primary-light/60',
      )}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '12px',
        padding: '7px 14px',
      }}
    >
      {isSong ? (
        <>
          <VinylIcon size={14} />
          Трекається у <b className="text-primary-light">{tracked.title}</b>
          <button
            className="opacity-80"
            onClick={onChangeTrack}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              marginInlineStart: '2px',
              background: 'none',
              border: 0,
              color: 'inherit',
            }}
            type="button"
          >
            змінити
          </button>
        </>
      ) : (
        <>
          <EyeOffIcon size={14} />
          Без трекінгу
          <button
            className="opacity-80"
            onClick={onChangeTrack}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              marginInlineStart: '2px',
              background: 'none',
              border: 0,
              color: 'inherit',
            }}
            type="button"
          >
            обрати твір
          </button>
        </>
      )}
    </div>
  );
}
