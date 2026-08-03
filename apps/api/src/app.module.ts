import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { BandsModule } from './bands/bands.module';
import { validate } from './config/env.validation';
import { RepertoireModule } from './repertoire/repertoire.module';

import { PrismaModule } from './prisma';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    AuthModule,
    BandsModule,
    PrismaModule,
    RepertoireModule,
  ],
})
export class AppModule {}
