import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Band, User } from '@nonsololarco/types';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BandDto } from './dto';
import { BandsService } from './bands.service';

@ApiTags('bands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bands for the current user' })
  @ApiOkResponse({
    type: [BandDto],
    description: 'List of user bands with computed stats',
  })
  getMyBands(@CurrentUser() user: User): Promise<Band[]> {
    return this.bandsService.getAll(user.id);
  }
}
