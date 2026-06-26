'use client';

import { useEffect, useRef } from 'react';

import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';
import { cn } from '@/src/lib/ui/utils/cn';

import DiscIllustration from './DiscIllustration';

/** Time for one full revolution. Shared by the RAF and CSS spin paths. */
const SPIN_PERIOD_MS = 2400;
const FULL_ROTATION_DEG = 360;

export interface VinylRecordProps {
  className?: string;
  color?: VinylColor;
  /** Spin continuously — for "Now playing" widget */
  isPlaying?: boolean;
  /** Diameter in px */
  size?: number;
}

export default function VinylRecord({
  className,
  color = 'olive',
  isPlaying = false,
  size = 56,
}: VinylRecordProps) {
  // RAF-based spin — preserves angle across hover sessions
  const discRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopSpin();
    }
  }, [isPlaying]);

  const startSpin = () => {
    const spin = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = time - lastTimeRef.current;
        angleRef.current =
          (angleRef.current + (delta / SPIN_PERIOD_MS) * FULL_ROTATION_DEG) % FULL_ROTATION_DEG;
        if (discRef.current) {
          discRef.current.style.transform = `rotate(${angleRef.current}deg)`;
        }
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
  };

  const stopSpin = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  };

  return (
    <div
      className={cn('shrink-0', isPlaying ? 'vinyl-spin-continuous' : 'cursor-pointer', className)}
      style={{
        width: size,
        height: size,
        transformOrigin: '50% 50%',
        animation: isPlaying ? `vinyl-spin-continuous ${SPIN_PERIOD_MS}ms linear infinite` : '',
      }}
      onMouseEnter={isPlaying ? undefined : startSpin}
      onMouseLeave={isPlaying ? undefined : stopSpin}
    >
      <div ref={discRef} style={{ width: size, height: size }}>
        <DiscIllustration color={color} size={size} />
      </div>
    </div>
  );
}
