import { VinylColor } from '../illustrations/vinyl-record.types';

export interface RepertoireStats {
  readyTracks: number;
  totalDuration: string; // e.g. "41 min"
  totalTracks: number;
}

export interface Band extends RepertoireStats {
  id: string;
  name: string;
  role?: string;
  tracks: string[];
  vinylColor?: VinylColor;
}
