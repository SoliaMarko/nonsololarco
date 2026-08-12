import { METRONOME_COLOR } from '../metronome-illustration.const';

export interface MetronomeArmProps {
  /** Drives the swing. When false the arm rests upright. */
  isSwinging: boolean;
  /** Seconds per half-swing — one tick of the beat. */
  beatSeconds: number;
  /** Hides the sliding weight; the compact variant keeps it, tiny sizes drop it. */
  showWeight?: boolean;
}

/**
 * The swinging arm, pivot end at the bottom.
 *
 * Rendered as an SVG group rather than a positioned `div` so it scales with
 * the illustration's `viewBox` instead of needing its own pixel maths at
 * every size. `transform-box: fill-box` is required for `transform-origin`
 * to resolve against the group's own bounds — without it SVG resolves the
 * origin against the whole user-space canvas and the arm swings off-screen.
 *
 * The animation is CSS rather than rAF: this is decorative, nothing is
 * synchronised to it, and a keyframe costs no JavaScript on the main thread.
 * The real metronome's pendulum uses rAF for exactly the opposite reason.
 *
 * Stopping is done with `animation-play-state`, not by removing the
 * animation. Removing it would snap the arm back to upright; pausing freezes
 * it wherever it happens to be and lets the next hover resume from there, so
 * there is no jump. The negative `animation-delay` of half a beat seeds the
 * paused-at-rest frame at the timeline's midpoint — which, for a swing from
 * −15° to +15°, is exactly upright — so the very first render still looks
 * balanced rather than leaning.
 */
export default function MetronomeArm({
  beatSeconds,
  isSwinging,
  showWeight = true,
}: MetronomeArmProps) {
  return (
    <g
      style={{
        animation: `metronome-swing ${beatSeconds}s ease-in-out ${-beatSeconds / 2}s infinite alternate`,
        animationPlayState: isSwinging ? 'running' : 'paused',
        transformBox: 'fill-box',
        transformOrigin: '50% 100%',
      }}
    >
      {/* Arm */}
      <rect fill={METRONOME_COLOR.slot} height="150" rx="2" width="4" x="88" y="59" />

      {/* Finial at the free end */}
      <circle
        cx="90"
        cy="59"
        fill={METRONOME_COLOR.brass}
        r="4.5"
        stroke={METRONOME_COLOR.brassDeep}
        strokeWidth="1.5"
      />

      {showWeight ? (
        <>
          <rect
            fill={METRONOME_COLOR.weight}
            height="18"
            rx="3"
            stroke={METRONOME_COLOR.weightDeep}
            strokeWidth="2"
            width="27"
            x="76.5"
            y="109"
          />
          {/* Index line — reads the tempo off the scale */}
          <rect
            fill={METRONOME_COLOR.weightDeep}
            height="2"
            opacity="0.7"
            width="21"
            x="79.5"
            y="117"
          />
        </>
      ) : null}
    </g>
  );
}
