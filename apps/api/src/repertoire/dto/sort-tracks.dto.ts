import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TrackSortField {
  TRACK_ORDER = 'trackOrder',
  TITLE = 'title',
  BPM = 'bpm',
  STATUS = 'status',
  TIME = 'time',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortTracksDto {
  @ApiPropertyOptional({ enum: TrackSortField })
  @IsOptional()
  @IsEnum(TrackSortField)
  sort?: TrackSortField;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
