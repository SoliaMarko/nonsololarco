import { ApiProperty } from '@nestjs/swagger';

import { TrackDto } from './track.dto';

/**
 * Swagger response shape for the paginated repertoire endpoints. Mirrors
 * `PaginatedResult<Track>` from `@nonsololarco/types` — the runtime value comes
 * from the service, this class exists only so the OpenAPI schema documents the
 * envelope.
 */
export class PaginatedTracksDto {
  @ApiProperty({ type: [TrackDto], description: 'Items on the current page' })
  data!: TrackDto[];

  @ApiProperty({
    example: 1,
    description: '1-based index of the returned page',
  })
  page!: number;

  @ApiProperty({
    example: 10,
    description: 'Items per page; equals `total` when not paginated',
  })
  pageSize!: number;

  @ApiProperty({ example: 42, description: 'Total items across every page' })
  total!: number;

  @ApiProperty({
    example: 5,
    description: 'ceil(total / pageSize), never below 1',
  })
  totalPages!: number;
}
