import { MusicalKey } from '../common/common.types';

export type TrackStatus = 'ready' | 'learning' | 'new' | 'archived';

/**
 * Filter type for UI filter bar.
 * 'active' = all non-archived tracks (ready | learning | new)
 */
export type TrackFilter = TrackStatus | 'all' | 'active';

export type TrackSide = 'a' | 'b';

/** Simplified track shown on Profile page */
export interface TrackSummary {
  bpm: number;
  id: string;
  musicalKey: MusicalKey;
  order: number;
  title: string;
}

export interface TrackMember {
  id: string;
  name: string;
}

/** Band reference on a track — present in /users/me/tracks, absent in /bands/:id/tracks */
export interface TrackBand {
  id: string;
  name: string;
}

/** Full track in band repertoire */
export interface Track extends TrackSummary {
  /**
   * Track length in whole seconds, e.g. `190` for a 3:10 track.
   *
   * Seconds rather than a `"m:ss"` string so the database can sort by it.
   * Render it with `formatTrackDuration` — the client formats, the server
   * does not.
   */
  durationSeconds: number;
  /** Band member who leads this track */
  leadMember: TrackMember;
  /**
   * Additional performers on this track (excluding the lead).
   * Empty for solo tracks; may contain band members for band tracks.
   */
  members: TrackMember[];
  side: TrackSide;
  status: TrackStatus;
  /**
   * Present when fetched via GET /users/me/tracks (all repertoires).
   * Absent when fetched via GET /bands/:id/tracks (band context is implicit).
   */
  band?: TrackBand;
}
