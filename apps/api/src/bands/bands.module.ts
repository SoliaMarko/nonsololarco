import { Module } from '@nestjs/common';
import { BandsController } from './bands.controller';

@Module({ controllers: [BandsController] })
export class BandsModule {}
