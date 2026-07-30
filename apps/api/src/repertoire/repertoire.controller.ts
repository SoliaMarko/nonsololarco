import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from '@nonsololarco/types';

import { TrackDto } from './dto';
import { MOCK_CURRENT_USER_ID } from 'src/mocks/repertoire.mock';
import { RepertoireService } from './repertoire.service';

@ApiTags('repertoire')
@Controller()
export class RepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get('users/me/repertoire')
  @ApiOperation({ summary: 'Get all tracks for the current user' })
  @ApiOkResponse({ type: [TrackDto], description: 'List of user tracks' })
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyRepertoire(): Track[] {
    return this.repertoireService.getByUser(MOCK_CURRENT_USER_ID);
  }

  @Get('bands/:id/repertoire')
  @ApiOperation({ summary: 'Get all tracks for a specific band' })
  @ApiParam({ name: 'id', description: 'Band ID', example: 'band-1' })
  @ApiOkResponse({
    type: [TrackDto],
    description: 'List of band tracks (without band field)',
  })
  @ApiNotFoundResponse({ description: 'Band not found' })
  getBandRepertoire(@Param('id') bandId: string): Track[] {
    return this.repertoireService.getByBand(bandId);
  }
}
