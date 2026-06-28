export type WishlistMediaKind = 'video' | 'sheet' | 'link';
export type WishlistVisibility = 'public' | 'private';

export interface WishlistMedia {
  kind: WishlistMediaKind;
  label?: string;
  url: string;
}

export interface WishlistTrack {
  id: string;
  media: WishlistMedia[];
  order: number;
  title: string;
  visibility: WishlistVisibility;
}
