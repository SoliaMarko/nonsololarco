'use client';

import { useId } from 'react';

import { PICK_PATH } from '@/src/lib/constants/illustrations/mediator-badge.const';
import { PickVariant } from '@/src/lib/types/illustrations/mediator-badge.types';
import { cn } from '@/src/lib/ui/utils/cn';

export interface MediatorBadgeProps {
  className?: string;
  /** Disable wobble animation */
  isStatic?: boolean;
  /** Size in px — scales the 104×101 viewBox */
  size?: number;
  variant?: PickVariant;
}

export default function MediatorBadge({
  className,
  isStatic = false,
  size = 104,
  variant = 'gold',
}: MediatorBadgeProps) {
  const gradId = useId().replace(/:/g, 'p');

  const scale = size / 104;
  const height = Math.round(101 * scale);

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={{
        width: size,
        height: height,
        perspective: 600,
      }}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          animation: isStatic ? undefined : 'pick-wobble 5s ease-in-out infinite',
        }}
      >
        <svg
          width={size}
          height={height}
          viewBox="0 0 104 101"
          role="img"
          aria-label={`Picks token — ${variant}`}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {variant === 'gold' ? (
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbe89a" />
                <stop offset="40%" stopColor="#f0c24b" />
                <stop offset="72%" stopColor="#d99a1e" />
                <stop offset="100%" stopColor="#a8730c" />
              </linearGradient>
            ) : null}
            {variant === 'hologram' ? (
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="32%" stopColor="#67e8f9" />
                <stop offset="55%" stopColor="#fef08a" />
                <stop offset="78%" stopColor="#fda4af" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            ) : null}
            {variant === 'onyx' ? (
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3a382f" />
                <stop offset="55%" stopColor="#1c1b16" />
                <stop offset="100%" stopColor="#0c0c0a" />
              </linearGradient>
            ) : null}
          </defs>

          {/* Shape */}
          {variant === 'gold' ? (
            <path
              d={PICK_PATH}
              fill={`url(#${gradId})`}
              style={{
                filter: 'drop-shadow(rgba(120,80,8,0.5) 0px -7px 13px)',
              }}
            />
          ) : null}

          {variant === 'hologram' ? (
            <path
              d={PICK_PATH}
              fill={`url(#${gradId})`}
              style={{
                animation: `pick-hue-${gradId} 6s linear infinite`,
                filter: 'drop-shadow(rgba(80,40,120,0.35) 0px -7px 13px)',
              }}
            />
          ) : null}

          {variant === 'onyx' ? (
            <path
              d={PICK_PATH}
              fill={`url(#${gradId})`}
              style={{
                filter: 'drop-shadow(rgba(0,0,0,0.6) 0px -7px 13px)',
              }}
            />
          ) : null}

          {/* Gold/Onyx border */}
          {variant === 'onyx' ? (
            <path d={PICK_PATH} fill="none" stroke="#c9a23e" strokeWidth="2.5" />
          ) : null}

          {/* Gloss top highlight */}
          {variant === 'gold' || variant === 'hologram' ? (
            <ellipse
              cx="46"
              cy="26"
              rx="22"
              ry="15"
              fill="rgba(255,255,255,0.75)"
              style={{ filter: 'blur(6px)' }}
            />
          ) : null}

          {/* Shine sweep */}
          {variant !== 'hologram' ? (
            <path
              d={PICK_PATH}
              fill="none"
              style={{
                position: 'absolute',
              }}
            />
          ) : null}

          {/* Music note */}
          <text
            x="52"
            y="60"
            textAnchor="middle"
            fontSize="26"
            fontWeight="800"
            fill={
              variant === 'gold'
                ? 'rgba(138,94,8,0.5)'
                : variant === 'onyx'
                  ? '#c9a23e'
                  : 'transparent'
            }
          >
            &#9834;
          </text>
        </svg>
      </div>
    </div>
  );
}
