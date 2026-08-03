import { Module } from '@nestjs/common';

import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';

@Module({
  controllers: [BandsController],
  providers: [BandsService],
})
export class BandsModule {}
