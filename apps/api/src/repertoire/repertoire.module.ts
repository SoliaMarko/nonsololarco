import { Module } from '@nestjs/common';
import { RepertoireController } from './repertoire.controller';

@Module({ controllers: [RepertoireController] })
export class RepertoireModule {}
