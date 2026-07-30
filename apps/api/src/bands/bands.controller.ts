import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Band } from '@nonsololarco/types';

import { BandDto } from './dto';
import { BandsService } from './bands.service';

@ApiTags('bands')
@Controller('users/me/bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all bands for the current user' })
  @ApiOkResponse({
    type: [BandDto],
    description: 'List of user bands with computed stats',
  })
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyBands(): Band[] {
    return this.bandsService.getAll();
  }
}
