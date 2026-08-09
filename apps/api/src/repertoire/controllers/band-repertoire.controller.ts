import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Track } from '@nonsololarco/types';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { SessionUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RepertoireQueryDto, TrackDto } from '../dto';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  getBandRepertoire(
    @Param('id') bandId: string,
    @Query() query: RepertoireQueryDto,
    @CurrentUser() user: SessionUser,
  ): Promise<Track[]> {
    return this.repertoireService.getByBand(bandId, user.id, query);
  }
}
