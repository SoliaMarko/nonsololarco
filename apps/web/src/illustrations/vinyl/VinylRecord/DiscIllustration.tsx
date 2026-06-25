import { useId } from 'react';

import { GROOVES, LABEL_COLOR } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

interface DiscIllustrationProps {
  color?: VinylColor;
  size?: number;
}

export default function DiscIllustration({ color = 'rust', size = 36 }: DiscIllustrationProps) {
  const gradientId = useId().replace(/:/g, 'g');

  const labelColor = LABEL_COLOR[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      role="img"
      aria-label={`Vinyl record — ${color}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <radialGradient id={gradientId} cx="36%" cy="29%" r="82%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="26%" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="58%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.20)" />
        </radialGradient>
      </defs>

      <circle cx="28" cy="28" r="28" fill="#161614" />

      {GROOVES.map((r, i) => (
        <circle
          key={r}
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={i % 2 === 0 ? 'rgba(255,255,255,0.075)' : 'rgba(255,255,255,0.03)'}
          strokeWidth="0.55"
        />
      ))}

      <circle cx="28" cy="28" r="12.4" fill={labelColor} />
      <circle cx="28" cy="28" r="12.4" fill="none" stroke="rgba(0,0,0,0.16)" strokeWidth="0.8" />
      <circle cx="28" cy="28" r="6.6" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.6" />
      <circle cx="28" cy="28" r="2.8" fill="#161614" />
      <circle cx="28" cy="28" r="2.8" fill="none" stroke="rgba(0,0,0,0.32)" strokeWidth="0.5" />

      <circle cx="28" cy="28" r="28" fill={`url(#${gradientId})`} />
    </svg>
  );
}
