import { Controller, Get } from '@nestjs/common';
import { Band } from '@nonsololarco/types';

import { MOCK_CURRENT_USER_ID } from '../repertoire/repertoire.mock';
import { BandsService } from './bands.service';

@Controller('users/me/bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  // TODO: Replace with real user ID once JWT authentication is implemented
  getMyBands(): Band[] {
    return this.bandsService.getByUser(MOCK_CURRENT_USER_ID);
  }
}
