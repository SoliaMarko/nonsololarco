import { ChooserSong, PracticeSession } from '@/src/lib/types/metronome.types';

// Deliberately unsorted, so the drawer's own ordering is exercised.
export const MOCK_PRACTICE_HISTORY: PracticeSession[] = [
  {
    bpm: 82,
    durationMs: 15 * 60000,
    id: 'h3',
    song: 'Night at the Depot',
    songNumber: 1,
    startedAt: '2026-05-02T19:10:00.000Z',
  },
  {
    bpm: 92,
    durationMs: 18 * 60000,
    id: 'h1',
    song: 'Night at the Depot',
    songNumber: 1,
    startedAt: '2026-06-04T18:30:00.000Z',
  },
  {
    bpm: 88,
    durationMs: 22 * 60000,
    id: 'h2',
    song: 'Night at the Depot',
    songNumber: 1,
    startedAt: '2026-05-28T20:05:00.000Z',
  },
  {
    bpm: 116,
    durationMs: 20 * 60000,
    id: 'h5',
    song: 'Trolleybus No. 7',
    songNumber: 2,
    startedAt: '2026-05-30T17:45:00.000Z',
  },
  {
    bpm: 120,
    durationMs: 12 * 60000,
    id: 'h4',
    song: 'Trolleybus No. 7',
    songNumber: 2,
    startedAt: '2026-06-06T16:20:00.000Z',
  },
  {
    bpm: 74,
    durationMs: 25 * 60000,
    id: 'h6',
    song: 'Salt on the Windows',
    songNumber: 3,
    startedAt: '2026-06-05T09:15:00.000Z',
  },
  {
    bpm: 100,
    durationMs: 16 * 60000,
    id: 'h8',
    song: 'Coffee at Six',
    songNumber: 4,
    startedAt: '2026-05-24T08:40:00.000Z',
  },
  {
    bpm: 104,
    durationMs: 14 * 60000,
    id: 'h7',
    song: 'Coffee at Six',
    songNumber: 4,
    startedAt: '2026-06-01T08:00:00.000Z',
  },
];

export const MOCK_REPERTOIRE_SONGS: ChooserSong[] = [
  { bpm: 92, key: 'Am', number: 1, ready: 'learning', title: 'Night at the Depot' },
  { bpm: 120, key: 'G', number: 2, ready: 'ready', title: 'Trolleybus No. 7' },
  { bpm: 74, key: 'Dm', number: 3, ready: 'new', title: 'Salt on the Windows' },
  { bpm: 104, key: 'C', number: 4, ready: 'learning', title: 'Coffee at Six' },
  { bpm: 138, key: 'Em', number: 5, ready: 'ready', title: 'Smoke over the Rooftops' },
  { bpm: 88, key: 'F', number: 6, ready: 'new', title: 'Silence in the City' },
];
