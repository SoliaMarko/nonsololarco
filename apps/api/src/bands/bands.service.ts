import { Injectable } from '@nestjs/common';
import { Band } from '@nonsololarco/types';

import { MOCK_ALL_REPERTOIRE } from '../repertoire/repertoire.mock';
import { sumDurations } from 'src/utils/duration.util';
import { MOCK_BANDS } from './bands.mock';

@Injectable()
export class BandsService {
  // TODO: Replace with Prisma queries once DB is connected
  getByUser(_userId: string): Band[] {
    return MOCK_BANDS.map((band) => {
      const bandTracks = MOCK_ALL_REPERTOIRE.filter(
        (track) => track.band?.id === band.id,
      );

      const readyTracks = bandTracks.filter(
        (track) => track.status === 'ready',
      ).length;

      const totalDuration = sumDurations(
        bandTracks.map((track) => track.duration),
      );

      return {
        ...band,
        totalTracks: bandTracks.length,
        readyTracks,
        totalDuration,
      };
    });
  }
}
