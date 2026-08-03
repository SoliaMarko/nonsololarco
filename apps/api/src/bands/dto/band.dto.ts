import { ApiProperty } from '@nestjs/swagger';

export class BandDto {
  @ApiProperty({ example: 'band-1' })
  id!: string;

  @ApiProperty({ example: 'Quiet Yard' })
  name!: string;

  @ApiProperty({ example: 'back vocal' })
  role!: string;

  @ApiProperty({ example: 6 })
  totalTracks!: number;

  @ApiProperty({ example: 5 })
  readyTracks!: number;

  @ApiProperty({ example: '19 min' })
  totalDuration!: string;
}
