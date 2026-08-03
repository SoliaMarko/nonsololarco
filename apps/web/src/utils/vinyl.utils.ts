import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { ALL_BANDS_ID, SOLO_BAND_ID } from '@/src/lib/constants/repertoire.const';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

/** Ids that are tabs rather than real bands, and so never get a palette color */
const PSEUDO_BAND_IDS: readonly string[] = [ALL_BANDS_ID, SOLO_BAND_ID];

/**
 * Assigns each band a vinyl color, cycling through the palette.
 *
 * Bands are sorted by id first, so a band keeps its color no matter what order
 * the caller passes them in or whether the "Solo" tab is present. Cycling —
 * rather than hashing each id independently — is what guarantees that adjacent
 * bands never land on the same color.
 */
export function buildBandColorMap(bandIds: readonly string[]): Map<string, VinylColor> {
  const realBandIds = [...new Set(bandIds)]
    .filter((id) => id && !PSEUDO_BAND_IDS.includes(id))
    .sort();

  return new Map(
    realBandIds.map((id, index) => [id, VINYL_COLORS[index % VINYL_COLORS.length] ?? 'solo']),
  );
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
