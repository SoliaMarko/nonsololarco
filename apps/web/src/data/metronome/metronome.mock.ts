import { ChooserSong, PracticeSession } from '@/src/lib/types/metronome.types';

export const MOCK_PRACTICE_HISTORY: PracticeSession[] = [
  { bpm: 92, date: '4 ЧЕРВ', duration: '18 хв', id: 'h1', song: 'Ніч у депо', songNumber: 1 },
  { bpm: 88, date: '28 ТРА', duration: '22 хв', id: 'h2', song: 'Ніч у депо', songNumber: 1 },
  { bpm: 82, date: '2 ТРА', duration: '15 хв', id: 'h3', song: 'Ніч у депо', songNumber: 1 },
  { bpm: 120, date: '6 ЧЕРВ', duration: '12 хв', id: 'h4', song: 'Тролейбус №7', songNumber: 2 },
  { bpm: 116, date: '30 ТРА', duration: '20 хв', id: 'h5', song: 'Тролейбус №7', songNumber: 2 },
  { bpm: 74, date: '5 ЧЕРВ', duration: '25 хв', id: 'h6', song: 'Сіль на вікнах', songNumber: 3 },
  {
    bpm: 104,
    date: '1 ЧЕРВ',
    duration: '14 хв',
    id: 'h7',
    song: 'Кава о шостій',
    songNumber: 4,
  },
  {
    bpm: 100,
    date: '24 ТРА',
    duration: '16 хв',
    id: 'h8',
    song: 'Кава о шостій',
    songNumber: 4,
  },
];

export const MOCK_REPERTOIRE_SONGS: ChooserSong[] = [
  { bpm: 92, key: 'Am', number: 1, ready: 'learning', title: 'Ніч у депо' },
  { bpm: 120, key: 'G', number: 2, ready: 'ready', title: 'Тролейбус №7' },
  { bpm: 74, key: 'Dm', number: 3, ready: 'new', title: 'Сіль на вікнах' },
  { bpm: 104, key: 'C', number: 4, ready: 'learning', title: 'Кава о шостій' },
  { bpm: 138, key: 'Em', number: 5, ready: 'ready', title: 'Дим над дахами' },
  { bpm: 88, key: 'F', number: 6, ready: 'new', title: 'Тиша у місті' },
];
