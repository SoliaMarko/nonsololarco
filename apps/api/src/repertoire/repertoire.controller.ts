import { Controller, Get, Param } from '@nestjs/common';
import { Track } from '@nonsololarco/types';

import { MOCK_CURRENT_USER_ID } from './repertoire.mock';
import { RepertoireService } from './repertoire.service';

@Controller()
export class RepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get('users/me/repertoire')
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyRepertoire(): Track[] {
    return this.repertoireService.getByUser(MOCK_CURRENT_USER_ID);
  }

  @Get('bands/:id/repertoire')
  getBandRepertoire(@Param('id') bandId: string): Track[] {
    return this.repertoireService.getByBand(bandId);
  }
}
