import { ApiProperty } from '@nestjs/swagger';

export class TrackBandDto {
  @ApiProperty({ example: 'band-1' })
  id!: string;

  @ApiProperty({ example: 'Quiet Yard' })
  name!: string;
}
