'use client';

import { CSSProperties, useState } from 'react';

import { cn } from '@/src/lib/ui/utils/cn';

export interface VinylCrateBar {
  color: string;
  tall?: boolean;
}

export interface VinylCrateProps {
  barClassName?: string;
  bars?: VinylCrateBar[];
  className?: string;
  cycleMs?: number;
  height?: number;
  /** Spin continuously — for "Now playing" widget. If false, animates on hover. */
  isPlaying?: boolean;
  speed?: number;
  travelInset?: number;
  width?: number;
}

const DEFAULT_BARS: VinylCrateBar[] = [
  { color: '#8aa06b', tall: false },
  { color: '#b24b3a', tall: true },
  { color: '#e0a92e', tall: false },
];

const VIEW_H = 32;
const BAR_W = 6.14;
const GAP = 2.4;
const SHORT_H = 29.36;
const DOT_D = 3.63;

export default function VinylCrate({
  barClassName,
  bars = DEFAULT_BARS,
  className,
  cycleMs = 4200,
  height = 32,
  isPlaying = false,
  speed = 1.8,
  travelInset = 4,
  width = 24,
}: VinylCrateProps) {
  const [isHovering, setIsHovering] = useState(false);
  const shouldAnimate = isPlaying || isHovering;

  const duration = cycleMs / speed;
  const barCount = bars.length;
  const viewWidth = barCount * BAR_W + Math.max(barCount - 1, 0) * GAP;

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${VIEW_H}`}
      width={width}
      height={height}
      className={cn('shrink-0', isPlaying ? undefined : 'cursor-pointer', className)}
      onMouseEnter={isPlaying ? undefined : () => setIsHovering(true)}
      onMouseLeave={isPlaying ? undefined : () => setIsHovering(false)}
    >
      {bars.map(({ color, tall }, i) => {
        const barHeight = tall ? VIEW_H : SHORT_H;
        const x = i * (BAR_W + GAP);
        const y = VIEW_H - barHeight;

        const dotR = DOT_D / 2;
        const bottomCy = y + barHeight - travelInset - dotR;
        const topCy = y + travelInset + dotR;
        const travel = bottomCy - topCy;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={BAR_W}
              height={barHeight}
              rx={1}
              className={cn('fill-contrast', barClassName)}
            />
            <circle
              cx={x + BAR_W / 2}
              cy={bottomCy}
              r={dotR}
              fill={color}
              style={
                {
                  '--travel': `${travel}px`,
                  animation: `wave-scan-dot ${duration}ms ease-in-out infinite`,
                  animationPlayState: shouldAnimate ? 'running' : 'paused',
                  animationDelay: `${-((i * duration) / barCount)}ms`,
                } as CSSProperties
              }
            />
          </g>
        );
      })}
    </svg>
  );
}
