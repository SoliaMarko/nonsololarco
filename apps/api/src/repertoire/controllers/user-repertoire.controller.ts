import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Track } from '@nonsololarco/types';

import { TrackDto } from '../dto';
import { MOCK_CURRENT_USER_ID } from 'src/constants/auth.const';
import { RepertoireService } from '../repertoire.service';

@ApiTags('repertoire')
@Controller('users/me/repertoire')
export class UserRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tracks for the current user' })
  @ApiOkResponse({ type: [TrackDto], description: 'List of user tracks' })
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyRepertoire(): Promise<Track[]> {
    return this.repertoireService.getByUser(MOCK_CURRENT_USER_ID);
  }
}
