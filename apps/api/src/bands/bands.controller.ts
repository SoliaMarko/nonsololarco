import { Controller, Get } from '@nestjs/common';
import { MOCK_BANDS } from './bands.mock';

@Controller('users/me/bands')
export class BandsController {
  @Get('')
  getAllBands() {
    return MOCK_BANDS;
  }
}
