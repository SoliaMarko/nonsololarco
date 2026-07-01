import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { MOCK_ALL_REPERTOIRE, MOCK_CURRENT_USER_ID } from './repertoire.mock';
import { Track } from '@nonsololarco/types';

@Controller()
export class RepertoireController {
  @Get('users/me/repertoire')
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyRepertoire() {
    return MOCK_ALL_REPERTOIRE.filter(
      (track) => track.leadMember?.id === MOCK_CURRENT_USER_ID,
    );
  }

  @Get('bands/:id/repertoire')
  getBandRepertoire(@Param('id') bandId: string): Track[] {
    const isBandExisting = MOCK_ALL_REPERTOIRE.some(
      (track) => track.band?.id === bandId,
    );

    if (!isBandExisting) {
      throw new NotFoundException(
        `Band with id ${bandId} not found in repertoire`,
      );
    }

    return MOCK_ALL_REPERTOIRE.filter((track) => track.band?.id === bandId).map(
      ({ band: _band, ...track }) => track,
    );
  }
}
