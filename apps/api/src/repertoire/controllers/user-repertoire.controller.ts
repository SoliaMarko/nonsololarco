import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedResult, Track } from '@nonsololarco/types';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { SessionUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginatedTracksDto, RepertoireQueryDto } from '../dto';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/repertoire')
export class UserRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all tracks where the current user is lead (band + solo)',
  })
  @ApiOkResponse({
    type: PaginatedTracksDto,
    description: 'List of user tracks',
  })
  getMyRepertoire(
    @CurrentUser() user: SessionUser,
    @Query() query: RepertoireQueryDto,
  ): Promise<PaginatedResult<Track>> {
    return this.repertoireService.getByUser(user.id, query);
  }

  @Get('solo')
  @ApiOperation({ summary: 'Get solo tracks for the current user (no band)' })
  @ApiOkResponse({
    type: PaginatedTracksDto,
    description: 'Paginated list of solo tracks',
  })
  getMySoloRepertoire(
    @CurrentUser() user: SessionUser,
    @Query() query: RepertoireQueryDto,
  ): Promise<PaginatedResult<Track>> {
    return this.repertoireService.getSoloByUser(user.id, query);
  }
}
