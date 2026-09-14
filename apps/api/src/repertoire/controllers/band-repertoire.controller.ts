import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedResult, Track } from '@nonsololarco/types';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { SessionUser } from '../../auth/decorators/current-user.decorator';
import { BandMembershipGuard } from '../../auth/guards/band-membership.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginatedTracksDto, RepertoireQueryDto } from '../dto';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@ApiBearerAuth()
// Order matters: JwtAuthGuard populates request.user, which
// BandMembershipGuard then needs to check membership against.
@UseGuards(JwtAuthGuard, BandMembershipGuard)
@Controller('bands/:id/repertoire')
export class BandRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks for a specific band' })
  @ApiParam({ name: 'id', description: 'Band ID', example: 'band-1' })
  @ApiOkResponse({
    type: PaginatedTracksDto,
    description: 'Paginated list of band tracks (without band field)',
  })
  @ApiForbiddenResponse({
    description:
      'Not a member of this band, or the band does not exist — the two are ' +
      'deliberately indistinguishable so band ids cannot be probed',
  })
  getBandRepertoire(
    @Param('id') bandId: string,
    @Query() query: RepertoireQueryDto,
    @CurrentUser() user: SessionUser,
  ): Promise<PaginatedResult<Track>> {
    return this.repertoireService.getByBand(bandId, user.id, query);
  }
}
