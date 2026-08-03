import { VINYL_COLORS } from '@/src/lib/constants/illustrations/vinyl-record.const';
import { ALL_BANDS_ID, SOLO_BAND_ID } from '@/src/lib/constants/repertoire.const';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

/** Ids that are tabs rather than real bands, and so never get a palette color */
const PSEUDO_BAND_IDS: readonly string[] = [ALL_BANDS_ID, SOLO_BAND_ID];

/**
 * djb2 hash processed from the string's tail.
 *
 * Processing in reverse means the suffix (which is the unique part of cuid-like
 * ids) is weighted heavily, so ids that share a long common prefix still land on
 * well-distributed palette slots.
 */
function hashBandId(id: string): number {
  let h = 5381;
  for (let i = id.length - 1; i >= 0; i--) {
    h = (((h << 5) + h) ^ id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Assigns each band a vinyl color derived from its id.
 *
 * Using a hash (rather than a sorted index) means a band's color is stable even
 * when other bands are added or removed — new bands do not shift existing colors.
 */
export function buildBandColorMap(bandIds: readonly string[]): Map<string, VinylColor> {
  const realBandIds = [...new Set(bandIds)].filter(
    (id) => id && !PSEUDO_BAND_IDS.includes(id),
  );

  return new Map(
    realBandIds.map((id) => [id, VINYL_COLORS[hashBandId(id) % VINYL_COLORS.length] ?? 'solo']),
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
