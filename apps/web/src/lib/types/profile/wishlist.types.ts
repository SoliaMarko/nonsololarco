export type WishlistMediaKind = 'video' | 'sheet' | 'link';
export type WishlistVisibility = 'public' | 'private';

export interface WishlistMedia {
  id: string;
  kind: WishlistMediaKind;
  url: string;
  label?: string;
}

export interface WishlistTrack {
  id: string;
  media: WishlistMedia[];
  order: number;
  title: string;
  visibility: WishlistVisibility;
}
