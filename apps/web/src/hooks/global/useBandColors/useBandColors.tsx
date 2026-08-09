'use client';

import { useMemo } from 'react';

import { useMyBands } from '@/src/lib/hooks/useBands';
import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';
import { buildBandColorMap, getBandVinylColor } from '@/src/utils/vinyl.utils';

/**
 * Global hook that derives a stable band → vinyl color map from the user's
 * bands. Usable on any page (repertoire, profile, band page, etc.).
 *
 * Returns a lookup function; callers never deal with the raw map.
 *
 * @param fallbackBandIds - Band ids to use before the query resolves, so
 *   colours are available on the first render (e.g. from a parent that
 *   already has the bands list).
 */
export function useBandColors(
  fallbackBandIds?: readonly string[],
): (bandId: string | null | undefined) => VinylColor {
  const { data: bands } = useMyBands();

  const colorMap = useMemo(
    () => buildBandColorMap(bands?.map((b) => b.id) ?? fallbackBandIds ?? []),
    [bands, fallbackBandIds],
  );

  return (bandId: string | null | undefined) => getBandVinylColor(colorMap, bandId);
}
