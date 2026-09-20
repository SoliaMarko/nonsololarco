import Image from 'next/image';

import { cn } from '@/src/utils/cn';

import LampPullKnob from './LampPullKnob';
import { LAMP_ASPECT, LAMP_IMAGE, LAMP_IMAGE_SIZE } from './ceiling-lamp-illustration.const';

export interface CeilingLampProps {
  className?: string;
  /** Rendered height in px. Width follows the 512:840 aspect ratio. */
  height?: number;
  /**
   * Force the lamp lit or unlit. Left out, it follows the document's
   * `data-theme` in CSS — which is what the theme toggle wants.
   */
  isOn?: boolean;
  /** Runs the pull-cord tug once. Reset it when the animation ends. */
  isPulling?: boolean;
  /** Accessible name. Omit for a decorative instance (`aria-hidden`). */
  title?: string;
}

const DEFAULT_HEIGHT = 240;

const LAYER = {
  /** Follows `data-theme`, so the right layer is up on the very first paint. */
  theme: { lit: 'opacity-0 light:opacity-100', unlit: 'opacity-100 light:opacity-0' },
  on: { lit: 'opacity-100', unlit: 'opacity-0' },
  off: { lit: 'opacity-0', unlit: 'opacity-100' },
} as const;

const IMAGE_BASE = 'absolute inset-0 size-full object-contain transition-opacity duration-300';

/**
 * Vintage pull-cord ceiling lamp, composited from three raster layers.
 *
 * Both body renders are always mounted and cross-faded by opacity rather than
 * swapped, so flipping the theme dissolves from one to the other instead of
 * flashing a gap while the second file decodes. The knob rides on top as its
 * own layer — see `LampPullKnob` for why it is cut out of the body.
 *
 * Which body shows is decided in CSS from `data-theme`, not from React state,
 * unless a caller forces it with `isOn`. An inline script sets that attribute
 * before first paint, so the lamp is already correct in the first frame; a
 * component that resolved the theme after mounting would show the dark lamp
 * and snap to the lit one on every page transition.
 *
 * Nothing here takes pointer events. The lamp hangs past the bottom of
 * whatever contains it, and a transparent image rect over the page would
 * swallow clicks on the content underneath; the knob opts back in, because a
 * rope end you cannot pull is a poor joke.
 *
 * @example
 * // Theme toggle in the header — follows the theme, decorative
 * <CeilingLamp height={76} isPulling={isPulling} />
 *
 * // Forced on, for a story or a hero illustration
 * <CeilingLamp isOn title="Ceiling lamp" />
 */
export default function CeilingLamp({
  className,
  height = DEFAULT_HEIGHT,
  isOn,
  isPulling = false,
  title,
}: CeilingLampProps) {
  const forced = LAYER[isOn ? 'on' : 'off'];
  const layer = isOn === undefined ? LAYER.theme : forced;

  return (
    <span
      {...(title ? { 'aria-label': title, role: 'img' } : { 'aria-hidden': true })}
      className={cn(
        'pointer-events-none relative block shrink-0 origin-top select-none',
        // The sway and the tug are the only transforms on the page that come
        // and go. Declaring them up front keeps the compositing layer alive
        // between clicks instead of letting the browser create and drop one
        // each time, which is what makes the overlay scrollbar blink.
        'will-change-transform',
        isPulling && 'animate-lamp-sway',
        className,
      )}
      style={{ height, width: height * LAMP_ASPECT }}
    >
      {/* Spill of light onto the wall behind. Painted by CSS rather than baked
          into the render so it can fade with the theme instead of popping.
          The box is sized as a share of the lamp, not in pixels, so the glow
          keeps its proportions from a 66px header lamp to a 220px hero. */}
      <span
        className={cn(
          'bg-lamp-glow absolute -inset-[35%] transition-opacity duration-300',
          layer.lit,
        )}
      />

      <Image
        alt=""
        className={cn(IMAGE_BASE, layer.unlit)}
        height={LAMP_IMAGE_SIZE.body.height}
        priority
        src={LAMP_IMAGE.bodyOff}
        width={LAMP_IMAGE_SIZE.body.width}
      />
      <Image
        alt=""
        className={cn(IMAGE_BASE, layer.lit)}
        height={LAMP_IMAGE_SIZE.body.height}
        priority
        src={LAMP_IMAGE.bodyOn}
        width={LAMP_IMAGE_SIZE.body.width}
      />

      <LampPullKnob isPulling={isPulling} />
    </span>
  );
}
