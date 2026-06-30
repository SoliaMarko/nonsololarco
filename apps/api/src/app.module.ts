import { Module } from '@nestjs/common';
import { RepertoireModule } from './repertoire/repertoire.module';

@Module({
  imports: [RepertoireModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
