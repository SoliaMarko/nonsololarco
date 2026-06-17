export type MusicalKey =
  | 'C'
  | 'Cm'
  | 'C#'
  | 'C#m'
  | 'D'
  | 'Dm'
  | 'D#'
  | 'D#m'
  | 'E'
  | 'Em'
  | 'F'
  | 'Fm'
  | 'F#'
  | 'F#m'
  | 'G'
  | 'Gm'
  | 'G#'
  | 'G#m'
  | 'A'
  | 'Am'
  | 'A#'
  | 'A#m'
  | 'B'
  | 'Bm';

/** A track from user's repertoire */
export interface LeadTrack {
  bpm: number;
  id: string;
  musicalKey: MusicalKey;
  order: number;
  title: string;
}

export type WishlistMediaKind = 'video' | 'sheet' | 'link';

export interface WishlistMedia {
  kind: WishlistMediaKind;
  label?: string;
  url: string;
}

export type WishlistVisibility = 'public' | 'private';

/** A track the user wants to learn (wishlist item) */
export interface WishlistTrack {
  id: string;
  media: WishlistMedia[];
  order: number;
  title: string;
  visibility: WishlistVisibility;
}
