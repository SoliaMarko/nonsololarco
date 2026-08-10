import { TrackStatus } from '@nonsololarco/types';

export type MetronomePhase = 'choose' | 'play';

export type TimeSignature = 3 | 4 | 6;

export interface PracticeSession {
  bpm: number;
  date: string;
  duration: string;
  id: string;
  song: string;
  songNumber: number;
}

export interface ChooserSong {
  bpm: number;
  key: string;
  number: number;
  ready: TrackStatus;
  title: string;
}
