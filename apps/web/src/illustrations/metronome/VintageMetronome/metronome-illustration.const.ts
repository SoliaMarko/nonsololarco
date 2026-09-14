/**
 * Palette for the vintage metronome illustration.
 *
 * These are fixed illustration colours, not theme tokens: the metronome is a
 * physical object drawn the same way in light and dark mode, the way a
 * photograph would be. Routing them through semantic tokens would make the
 * wood turn cream in dark mode.
 */
export const METRONOME_COLOR = {
  /** Warm highlight along lit edges. */
  woodLight: '#C08A4E',
  woodMid: '#9A6533',
  woodDark: '#5C3917',
  woodBase: '#6E4420',
  /** Recessed front panel, one step darker than the body. */
  panelLight: '#8A5A2B',
  panelDark: '#5A3718',
  /** Brass fittings — finial, key plate, pivot diamond. */
  brass: '#D3AC58',
  brassDeep: '#8C6A28',
  /** The slot the arm swings in, and the arm itself. */
  slot: '#241710',
  /** Scale ticks and numerals. */
  scaleTick: '#C9B488',
  scaleText: '#EAD9B0',
  /** Sliding weight — the one non-wood accent. */
  weight: '#B23A28',
  weightDeep: '#741F14',
} as const;

/** Tick positions on the BPM scale, paired with the tempo each one marks. */
export const SCALE_MARKS = [
  { bpm: 40, y: 198 },
  { bpm: 50, y: 184.7 },
  { bpm: 60, y: 171.3 },
  { bpm: 72, y: 158 },
  { bpm: 84, y: 144.7 },
  { bpm: 100, y: 131.3 },
  { bpm: 120, y: 118 },
  { bpm: 144, y: 104.7 },
  { bpm: 168, y: 91.3 },
  { bpm: 200, y: 78 },
] as const;

/** Minor ticks sit halfway between each labelled pair. */
export const MINOR_TICK_Y = [191.3, 178, 164.6, 151.3, 138, 124.6, 111.3, 98, 84.6] as const;

/** Wood grain curves on the body, drawn behind the front panel. */
export const GRAIN_PATHS = [
  'M68 238 Q 70.9 144 79 52',
  'M86 238 Q 86.5 144 88 52',
  'M104 238 Q 102.2 144 97 52',
  'M122 238 Q 117.8 144 106 52',
] as const;
