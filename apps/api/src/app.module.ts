import { Module } from '@nestjs/common';

import { BandsModule } from './bands/bands.module';
import { PrismaModule } from './prisma';
import { RepertoireModule } from './repertoire/repertoire.module';

@Module({
  imports: [PrismaModule, BandsModule, RepertoireModule],
})
export class AppModule {}
