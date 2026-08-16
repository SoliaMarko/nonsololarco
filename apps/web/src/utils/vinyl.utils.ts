import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { ALL_BANDS_ID, SOLO_BAND_ID } from '@/src/lib/constants/repertoire.const';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

/** Ids that are tabs rather than real bands, and so never get a palette color */
const PSEUDO_BAND_IDS: readonly string[] = [ALL_BANDS_ID, SOLO_BAND_ID];

/**
 * Assigns each band a vinyl color, cycling through the palette while
 * guaranteeing no two adjacent bands share the same color.
 *
 * Bands are sorted by id so the assignment is deterministic regardless of
 * the order the caller passes them. When a band is added or removed some
 * downstream colors may shift — an acceptable tradeoff for zero adjacent
 * repeats across tabs, track rows, and the profile page.
 */
export function buildBandColorMap(bandIds: readonly string[]): Map<string, VinylColor> {
  const realBandIds = [...new Set(bandIds)]
    .filter((id) => id && !PSEUDO_BAND_IDS.includes(id))
    .sort();

  const map = new Map<string, VinylColor>();
  let paletteIndex = 0;

  for (const id of realBandIds) {
    const color = VINYL_COLORS[paletteIndex % VINYL_COLORS.length] ?? 'solo';
    map.set(id, color);
    paletteIndex++;

    // If the next color would be the same as this one (palette wrapped), skip it
    if (realBandIds.length > 1 && VINYL_COLORS[paletteIndex % VINYL_COLORS.length] === color) {
      paletteIndex++;
    }
  }

  return map;
}

/**
 * Reads a band's color out of the map.
 *
 * Solo tracks and the "Solo" tab have no band, so they get the reserved blank
 * white label.
 */
export function getBandVinylColor(
  colorMap: Map<string, VinylColor>,
  bandId: string | null | undefined,
): VinylColor {
  if (!bandId || PSEUDO_BAND_IDS.includes(bandId)) return 'solo';

  return colorMap.get(bandId) ?? 'solo';
}
