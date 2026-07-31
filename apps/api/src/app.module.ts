import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { BandsModule } from './bands/bands.module';
import { RepertoireModule } from './repertoire/repertoire.module';

import { PrismaModule } from './prisma';

@Module({
  imports: [AuthModule, BandsModule, PrismaModule, RepertoireModule],
})
export class AppModule {}
