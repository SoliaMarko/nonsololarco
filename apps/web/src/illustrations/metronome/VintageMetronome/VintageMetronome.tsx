'use client';

import { useId, useState } from 'react';

import { cn } from '@/src/utils/cn';

import MetronomeArm from './MetronomeArm';
import MetronomeScale from './MetronomeScale';
import { GRAIN_PATHS, METRONOME_COLOR } from './metronome-illustration.const';

export type VintageMetronomeVariant = 'compact' | 'detailed';

export interface VintageMetronomeProps {
  className?: string;
  /** Seconds per half-swing. Lower is faster; 0.7 reads as a brisk allegro. */
  beatSeconds?: number;
  /** Rendered height in px. Width follows the 180:268 aspect ratio. */
  height?: number;
  /**
   * Swing continuously. Leave false to animate on hover and keyboard focus
   * only — the default, and the right choice for a button.
   */
  isSwinging?: boolean;
  /** Accessible name. Omit for a decorative instance (`aria-hidden`). */
  title?: string;
  /**
   * `detailed` draws the full instrument — wood grain, BPM scale with
   * numerals, M.M. key plate. `compact` keeps only the silhouette that
   * survives at button size: body, panel, slot, arm and weight.
   */
  variant?: VintageMetronomeVariant;
}

const VIEW_W = 180;
const VIEW_H = 268;
const ASPECT = VIEW_W / VIEW_H;

/**
 * Vintage wooden metronome, drawn as a single inline SVG.
 *
 * Two variants exist because the same drawing cannot serve a 268 px hero and
 * a 36 px button. `detailed` is the full instrument; `compact` drops the
 * engraved scale, numerals, grain and key plate, which at button size
 * collapse into visual noise. Everything else — proportions, palette,
 * viewBox — is shared, so the two read as the same object.
 *
 * Animation is opt-in. With `isSwinging` unset the arm rests upright and
 * starts swinging on hover or keyboard focus, which keeps it quiet in a
 * header. `prefers-reduced-motion` disables the swing entirely; the CSS for
 * that lives with the `metronome-swing` keyframe in `globals.css`.
 *
 * @example
 * // Hero illustration on an empty state
 * <VintageMetronome height={268} title="Metronome" />
 *
 * // Inside a button — decorative, the button carries the label
 * <VintageMetronome variant="compact" height={34} />
 */
export default function VintageMetronome({
  beatSeconds = 0.7,
  className,
  height = VIEW_H,
  isSwinging,
  title,
  variant = 'detailed',
}: VintageMetronomeProps) {
  const [isHovering, setIsHovering] = useState(false);
  const titleId = useId();
  const bodyGradientId = useId();
  const panelGradientId = useId();

  const isDetailed = variant === 'detailed';
  const shouldSwing = isSwinging ?? isHovering;

  return (
    <svg
      {...(title ? { 'aria-labelledby': titleId, role: 'img' } : { 'aria-hidden': true })}
      className={cn('shrink-0', className)}
      height={height}
      onBlur={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => setIsHovering(false)}
      preserveAspectRatio="xMidYMid meet"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={height * ASPECT}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title id={titleId}>{title}</title> : null}

      <defs>
        <linearGradient id={bodyGradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={METRONOME_COLOR.woodLight} />
          <stop offset="42%" stopColor={METRONOME_COLOR.woodMid} />
          <stop offset="100%" stopColor={METRONOME_COLOR.woodDark} />
        </linearGradient>
        <linearGradient id={panelGradientId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={METRONOME_COLOR.panelLight} />
          <stop offset="100%" stopColor={METRONOME_COLOR.panelDark} />
        </linearGradient>
      </defs>

      {/* Contact shadow */}
      <ellipse cx="90" cy="258" fill="rgba(20,15,8,0.18)" rx="76" ry="8" />

      {/* Plinth */}
      <rect fill={METRONOME_COLOR.woodDark} height="18" rx="3" width="140" x="20" y="242" />
      <rect fill={METRONOME_COLOR.woodBase} height="9" rx="2.5" width="152" x="14" y="236" />
      <rect
        fill={METRONOME_COLOR.woodLight}
        height="3.5"
        opacity="0.6"
        rx="2"
        width="152"
        x="14"
        y="236"
      />

      {/* Tapered body */}
      <path
        d="M40 240 L140 240 L115 48 L65 48 Z"
        fill={`url(#${bodyGradientId})`}
        stroke={METRONOME_COLOR.woodDark}
        strokeLinejoin="round"
        strokeWidth="1.5"
      />

      {isDetailed
        ? GRAIN_PATHS.map((d) => (
            <path key={d} d={d} fill="none" stroke="rgba(58,33,12,0.28)" strokeWidth="1.1" />
          ))
        : null}

      {/* Crown and brass finial */}
      <rect
        fill={METRONOME_COLOR.woodBase}
        height="9"
        rx="2.5"
        stroke={METRONOME_COLOR.woodDark}
        strokeWidth="1"
        width="60"
        x="60"
        y="42"
      />
      <rect
        fill={METRONOME_COLOR.woodLight}
        height="3"
        opacity="0.5"
        rx="1.5"
        width="56"
        x="62"
        y="42"
      />
      <rect fill={METRONOME_COLOR.brassDeep} height="13" rx="2" width="10" x="85" y="30" />
      <circle
        cx="90"
        cy="26"
        fill={METRONOME_COLOR.brass}
        r="7.5"
        stroke={METRONOME_COLOR.brassDeep}
        strokeWidth="1"
      />
      <circle cx="87.5" cy="23.5" fill="#fff" opacity="0.5" r="2.4" />

      {/* Recessed front panel */}
      <path
        d="M53 236 L127 236 L108 58 L72 58 Z"
        fill={`url(#${panelGradientId})`}
        stroke={METRONOME_COLOR.panelDark}
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path d="M53 236 L72 58 L75 58 L57 236 Z" fill={METRONOME_COLOR.woodLight} opacity="0.18" />

      {/* Arm slot */}
      <rect
        fill={METRONOME_COLOR.slot}
        height="134"
        rx="8"
        stroke={METRONOME_COLOR.panelDark}
        strokeWidth="1.4"
        width="16"
        x="82"
        y="70"
      />
      <rect fill="#fff" height="130" opacity="0.06" rx="2" width="4" x="84.5" y="72" />

      {isDetailed ? <MetronomeScale /> : null}

      {/* M.M. key plate — Mälzel's Metronome, stamped on every original */}
      {isDetailed ? (
        <>
          <ellipse
            cx="90"
            cy="224"
            fill={METRONOME_COLOR.brass}
            rx="15"
            ry="9"
            stroke={METRONOME_COLOR.brassDeep}
            strokeWidth="1"
          />
          <text
            dominantBaseline="central"
            fill={METRONOME_COLOR.brassDeep}
            fontSize="7"
            fontWeight="800"
            letterSpacing="0.04em"
            textAnchor="middle"
            x="90"
            y="225"
          >
            M.M
          </text>
        </>
      ) : null}

      <MetronomeArm
        beatSeconds={beatSeconds}
        isSwinging={shouldSwing}
        showWeight={isDetailed || height >= 28}
      />

      {/* Pivot diamond, drawn last so the arm passes behind it */}
      <polygon
        fill={METRONOME_COLOR.brass}
        points="90,201 98,209 90,217 82,209"
        stroke={METRONOME_COLOR.brassDeep}
        strokeWidth="1"
      />
      <circle cx="90" cy="209" fill={METRONOME_COLOR.slot} r="2.6" />
    </svg>
  );
}
