import { WishlistTrack } from '@/src/lib/types/profile/wishlist.types';

export const MOCK_WISHLIST: WishlistTrack[] = [
  {
    id: 'wt-1',
    order: 1,
    title: 'Chaconne (Bach)',
    visibility: 'public',
    media: [
      { id: 'vi-1', kind: 'video', url: 'https://youtube.com/watch?v=x', label: 'reference' },
      { id: 'sh-1', kind: 'sheet', url: 'https://example.com/sheet.pdf', label: 'sheet music' },
    ],
  },
  {
    id: 'wt-2',
    order: 2,
    title: 'Méditation (Massenet)',
    visibility: 'public',
    media: [{ id: 'li-1', kind: 'link', url: 'https://example.com', label: 'info' }],
  },
  {
    id: 'wt-3',
    order: 3,
    title: 'Personal experiment',
    visibility: 'private',
    media: [],
  },
];
