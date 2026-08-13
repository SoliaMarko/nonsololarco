import { METRONOME_COLOR, MINOR_TICK_Y, SCALE_MARKS } from '../metronome-illustration.const';

export interface MetronomeScaleProps {
  /** Draws the BPM numerals beside the major ticks. */
  showNumerals?: boolean;
}

/**
 * The engraved BPM scale to the right of the arm slot.
 *
 * Major ticks are longer and carry a numeral; minor ticks mark the halfway
 * point between two tempos. Both are decorative — the numbers are cosmetic
 * and do not track the app's actual BPM state.
 */
export default function MetronomeScale({ showNumerals = true }: MetronomeScaleProps) {
  return (
    <g aria-hidden="true">
      {SCALE_MARKS.map(({ bpm, y }) => (
        <line
          key={`major-${bpm}`}
          stroke={METRONOME_COLOR.scaleTick}
          strokeWidth="1.6"
          x1="100"
          x2="113"
          y1={y}
          y2={y}
        />
      ))}

      {MINOR_TICK_Y.map((y) => (
        <line
          key={`minor-${y}`}
          stroke={METRONOME_COLOR.scaleTick}
          strokeWidth="1"
          x1="100"
          x2="108"
          y1={y}
          y2={y}
        />
      ))}

      {showNumerals
        ? SCALE_MARKS.map(({ bpm, y }) => (
            <text
              key={`label-${bpm}`}
              dominantBaseline="central"
              fill={METRONOME_COLOR.scaleText}
              fontSize="7"
              fontWeight="700"
              x="116"
              y={y}
            >
              {bpm}
            </text>
          ))
        : null}
    </g>
  );
}
