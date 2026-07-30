import { Module } from '@nestjs/common';

import { BandRepertoireController } from './controllers/band-repertoire.controller';
import { RepertoireService } from './repertoire.service';
import { UserRepertoireController } from './controllers/user-repertoire.controller';

@Module({
  controllers: [UserRepertoireController, BandRepertoireController],
  providers: [RepertoireService],
  exports: [RepertoireService],
})
export class RepertoireModule {}
