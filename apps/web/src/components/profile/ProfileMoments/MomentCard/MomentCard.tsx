import Image from 'next/image';

import { ImageIcon, PlayIcon } from '@/src/icons/base';
import { MomentType } from '@/src/lib/types/profile/profile.types';
import { cn } from '@/src/lib/ui/utils/cn';

export interface MomentCardProps {
  className?: string;
  /** Owner can add/replace media; visitors only view */
  isOwnProfile?: boolean;
  moment: MomentType;
}

export default function MomentCard({ className, isOwnProfile, moment }: MomentCardProps) {
  const isVideo = moment.kind === 'video';
  const isEmpty = moment.thumbnailUrl === null;

  const handleClick = () => {
    if (isVideo && moment.videoUrl) {
      window.open(moment.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isVideo && moment.videoUrl && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      window.open(moment.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden',
        'bg-card border-fg-secondary border-2',
        'shadow-[4px_4px_0px_0px_var(--color-fg-secondary)]',
        isVideo && 'cursor-pointer',
        className,
      )}
      onClick={isVideo ? handleClick : () => {}}
      onKeyDown={isVideo ? handleKeyDown : () => {}}
      role={isVideo ? 'button' : undefined}
      tabIndex={isVideo ? 0 : undefined}
    >
      {isVideo ? (
        <div
          className="absolute inset-x-0 top-0 z-10 h-3"
          style={{
            background:
              'repeating-linear-gradient(90deg, var(--color-fg-secondary) 0, var(--color-fg-secondary) 8px, transparent 8px, transparent 14px)',
          }}
          aria-hidden="true"
        />
      ) : null}

      <div className="relative flex h-full min-h-32 w-full items-center justify-center">
        {isEmpty ? (
          <div className="text-fg-tertiary flex flex-col items-center gap-2">
            <ImageIcon size={28} aria-hidden="true" />
            <span className="text-sm">{isOwnProfile ? `↓ ${isVideo ? 'відео' : 'фото'}` : ''}</span>
          </div>
        ) : (
          <Image
            src={moment.thumbnailUrl ?? ''}
            alt={moment.caption}
            fill
            className="object-cover"
          />
        )}

        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'flex size-12 items-center justify-center rounded-full',
                'bg-accent-red text-white',
                'border-secondary-light border-2',
                'transition-transform group-hover:scale-110',
              )}
            >
              <PlayIcon className="translate-x-0.5" size={20} aria-hidden="true" />
            </div>
          </div>
        ) : null}
      </div>

      {isVideo && moment.duration ? (
        <div className="bg-fg-secondary pli-2 plb-1 absolute top-5 right-2 z-10 flex">
          <span className="text-base text-xs font-medium tabular-nums">▶ {moment.duration}</span>
        </div>
      ) : null}

      <div className="plb-2 pli-3 from-fg-secondary/80 absolute inset-x-0 bottom-0 z-10 bg-linear-to-t to-transparent">
        <span className="text-secondary-light text-xs font-medium tracking-wider uppercase">
          {moment.caption}
        </span>
      </div>

      {isVideo ? (
        <div
          className="absolute inset-x-0 top-0 z-0 h-1.5 opacity-25"
          style={{
            background:
              'repeating-linear-gradient(90deg, var(--color-fg-secondary) 0, var(--color-fg-secondary) 5px, transparent 5px, transparent 10px)',
          }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
