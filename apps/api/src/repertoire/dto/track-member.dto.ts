import { ApiProperty } from '@nestjs/swagger';

export class TrackMemberDto {
  @ApiProperty({ example: 'mock-user-solomiia' })
  id!: string;

  @ApiProperty({ example: 'Solomiia' })
  name!: string;
}
