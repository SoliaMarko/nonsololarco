import { VinylColor } from '../illustrations/vinyl-record.types';

export interface RepertoireStats {
  readyTracks: number;
  totalDuration: string;
  totalTracks: number;
}

export interface Band extends RepertoireStats {
  id: string;
  name: string;
  role?: string;
  /**
   * Track IDs for this band — loaded on demand when band is selected.
   * May be undefined or empty. Always use totalTracks for count display.
   */
  trackIds?: string[];
  vinylColor?: VinylColor;
}
