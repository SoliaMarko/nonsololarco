import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TrackBandDto } from './track-band.dto';
import { TrackMemberDto } from './track-member.dto';

export class TrackDto {
  @ApiProperty({ example: 't-1' })
  id!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty({ example: 'Yard in the fog' })
  title!: string;

  @ApiProperty({ type: TrackMemberDto })
  leadMember!: TrackMemberDto;

  @ApiPropertyOptional({
    type: TrackBandDto,
    description:
      'Present in /users/me/repertoire responses, absent in /bands/:id/repertoire',
  })
  band?: TrackBandDto;

  @ApiProperty({ example: 'a', enum: ['a', 'b'] })
  side!: string;

  @ApiProperty({ example: 'Am' })
  musicalKey!: string;

  @ApiProperty({ example: 68 })
  bpm!: number;

  @ApiProperty({
    example: 'ready',
    enum: ['ready', 'learning', 'new', 'archived'],
  })
  status!: string;

  @ApiProperty({
    example: 190,
    description: 'Track length in whole seconds. 190 renders as "3:10".',
  })
  durationSeconds!: number;
}
