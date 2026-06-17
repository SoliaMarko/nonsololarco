import { LeadTrack, WishlistTrack } from '@/src/lib/types/repertoire/repertoire.types';

export const MOCK_LEAD_TRACKS: LeadTrack[] = [
  { id: 'lt-1', order: 1, title: 'Smoke over the city', musicalKey: 'F', bpm: 96 },
  { id: 'lt-2', order: 2, title: 'Coffee at six', musicalKey: 'C', bpm: 108 },
  { id: 'lt-3', order: 3, title: 'Night at the depot', musicalKey: 'Am', bpm: 92 },
  { id: 'lt-4', order: 4, title: 'Quiet harbour', musicalKey: 'D', bpm: 72 },
];

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
