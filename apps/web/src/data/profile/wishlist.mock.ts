import { WishlistTrack } from '@/src/lib/types/profile/wishlist.types';

export const MOCK_WISHLIST: WishlistTrack[] = [
  {
    id: 'wt-1',
    order: 1,
    title: 'Chaconne (Bach)',
    visibility: 'public',
    media: [
      { kind: 'video', url: 'https://youtube.com/watch?v=x', label: 'reference' },
      { kind: 'sheet', url: 'https://example.com/sheet.pdf', label: 'sheet music' },
    ],
  },
  {
    id: 'wt-2',
    order: 2,
    title: 'Méditation (Massenet)',
    visibility: 'public',
    media: [{ kind: 'link', url: 'https://example.com', label: 'info' }],
  },
  {
    id: 'wt-3',
    order: 3,
    title: 'Personal experiment',
    visibility: 'private',
    media: [],
  },
];
