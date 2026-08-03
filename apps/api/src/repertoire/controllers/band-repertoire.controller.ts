import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Track } from '@nonsololarco/types';

import { TrackDto } from '../dto';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@Controller('bands/:id/repertoire')
export class BandRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks for a specific band' })
  @ApiParam({ name: 'id', description: 'Band ID', example: 'band-1' })
  @ApiOkResponse({
    type: [TrackDto],
    description: 'List of band tracks (without band field)',
  })
  @ApiNotFoundResponse({ description: 'Band not found' })
  getBandRepertoire(@Param('id') bandId: string): Promise<Track[]> {
    return this.repertoireService.getByBand(bandId);
  }
}
