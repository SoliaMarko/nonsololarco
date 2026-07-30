import { Injectable } from '@nestjs/common';
import { Band } from '@nonsololarco/types';

import { MOCK_ALL_REPERTOIRE } from 'src/mocks/repertoire.mock';
import { sumDurations } from 'src/utils/duration.util';
import { MOCK_BANDS } from 'src/mocks/bands.mock';

@Injectable()
export class BandsService {
  // TODO: Add userId param and filter by membership once auth + DB are in place
  getAll(): Band[] {
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
