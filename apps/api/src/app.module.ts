import { Module } from '@nestjs/common';
import { RepertoireModule } from './repertoire/repertoire.module';
import { BandsModule } from './bands/bands.module';

@Module({
  imports: [BandsModule, RepertoireModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
