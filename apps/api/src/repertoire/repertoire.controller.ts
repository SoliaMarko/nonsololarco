import { Controller, Get } from '@nestjs/common';
import { MOCK_ALL_REPERTOIRE } from './repertoire.mock';

@Controller('users/me')
export class RepertoireController {
  @Get('repertoire')
  getMyRepertoire() {
    return MOCK_ALL_REPERTOIRE;
  }
}
