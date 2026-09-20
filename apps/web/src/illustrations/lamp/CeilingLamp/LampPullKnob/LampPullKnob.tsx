import Image from 'next/image';

import { cn } from '@/src/utils/cn';

import { LAMP_IMAGE, LAMP_IMAGE_SIZE, LAMP_KNOB_BOX } from '../ceiling-lamp-illustration.const';

export interface LampPullKnobProps {
  /** Runs the tug: the knob drops, overshoots on the way back and settles. */
  isPulling: boolean;
}

/**
 * The wooden knob at the end of the pull cord, as its own layer.
 *
 * One image serves both lamp states: the two renders differ by less than five
 * levels here, and at header size the knob is eight pixels wide. Shipping a
 * lit and an unlit copy would double the request for a difference nobody can
 * see.
 *
 * Positioned in percentages of the lamp box rather than pixels, so the layer
 * stays registered to the body at any rendered height.
 */
export default function LampPullKnob({ isPulling }: LampPullKnobProps) {
  return (
    <Image
      alt="lamp-pull-knob"
      aria-hidden
      className={cn(
        'pointer-events-auto absolute h-auto will-change-transform',
        isPulling && 'animate-lamp-pull',
      )}
      height={LAMP_IMAGE_SIZE.knob.height}
      src={LAMP_IMAGE.knob}
      style={LAMP_KNOB_BOX}
      width={LAMP_IMAGE_SIZE.knob.width}
    />
  );
}
