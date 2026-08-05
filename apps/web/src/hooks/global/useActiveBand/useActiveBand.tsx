'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Band } from '@nonsololarco/types';

import { VinylColor } from '@/src/lib/types/illustrations/vinyl-record.types';

import { useBandColors } from '../useBandColors';

interface ActiveBandContextValue {
  /** Full band object for the active tab */
  activeBand: Band | undefined;
  /** Band ID from URL, or fallback to first band's ID */
  activeBandId: string;
  /** Stable vinyl color for a band — `solo` when there is no band */
  getVinylColor: (bandId: string | null | undefined) => VinylColor;
  /** Whether a specific band (not "All Repertoires") is selected */
  isSpecificBandSelected: boolean;
  /** Navigate to a different band tab */
  onBandChange: (bandId: string) => void;
}

const ActiveBandContext = createContext<ActiveBandContextValue | null>(null);

interface ActiveBandProviderProps {
  bands: Band[];
  children: ReactNode;
}

export function ActiveBandProvider({ bands, children }: ActiveBandProviderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getVinylColor = useBandColors();

  const value = useMemo(() => {
    const rawId = searchParams.get('band');
    const activeBand = bands.find((b) => b.id === rawId) ?? bands[0];
    const activeBandId = activeBand?.id ?? '';
    const isSpecificBandSelected = Boolean(rawId && activeBand?.id === rawId);

    function onBandChange(bandId: string) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('band', bandId);
      router.push(`?${params.toString()}`);
    }

    return {
      activeBand,
      activeBandId,
      getVinylColor,
      isSpecificBandSelected,
      onBandChange,
    };
  }, [bands, searchParams, router, getVinylColor]);

  return <ActiveBandContext.Provider value={value}>{children}</ActiveBandContext.Provider>;
}

export function useActiveBand(): ActiveBandContextValue {
  const context = useContext(ActiveBandContext);

  if (!context) {
    throw new Error('useActiveBand must be used within <ActiveBandProvider>');
  }

  return context;
}
