import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '@nonsololarco/types';

import { MOCK_ALL_REPERTOIRE } from '../mocks/repertoire.mock';

@Injectable()
export class RepertoireService {
  // TODO: Replace with Prisma repository once DB is connected
  getByUser(userId: string): Track[] {
    return MOCK_ALL_REPERTOIRE.filter(
      (track) => track.leadMember?.id === userId,
    );
  }

  getByBand(bandId: string): Track[] {
    const tracks = MOCK_ALL_REPERTOIRE.filter(
      (track) => track.band?.id === bandId,
    );

    if (!tracks.length) {
      throw new NotFoundException(`Band with id ${bandId} not found`);
    }

    return tracks.map(({ band: _band, ...rest }) => rest);
  }
}
