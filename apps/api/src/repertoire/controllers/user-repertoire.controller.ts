import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Track } from '@nonsololarco/types';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { SessionUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TrackDto } from '../dto';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/repertoire')
export class UserRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks where the current user is lead (band + solo)' })
  @ApiOkResponse({ type: [TrackDto], description: 'List of user tracks' })
  getMyRepertoire(@CurrentUser() user: SessionUser): Promise<Track[]> {
    return this.repertoireService.getByUser(user.id);
  }

  @Get('solo')
  @ApiOperation({ summary: 'Get solo tracks for the current user (no band)' })
  @ApiOkResponse({ type: [TrackDto], description: 'List of solo tracks' })
  getMySoloRepertoire(@CurrentUser() user: SessionUser): Promise<Track[]> {
    return this.repertoireService.getSoloByUser(user.id);
  }
}
