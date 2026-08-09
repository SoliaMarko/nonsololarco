import { IsBoolean, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

export enum TrackFilterField {
  ALL = 'all',
  READY = 'ready',
  LEARNING = 'learning',
  NEW = 'new',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export class RepertoireQueryDto {
  @ApiPropertyOptional({ enum: TrackSortField })
  @IsOptional()
  @IsEnum(TrackSortField)
  sort?: TrackSortField;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;

  @ApiPropertyOptional({ enum: TrackFilterField, default: TrackFilterField.ALL })
  @IsOptional()
  @IsEnum(TrackFilterField)
  status?: TrackFilterField;

  @ApiPropertyOptional({ description: 'Show only tracks where current user participates' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === '1' || value === true)
  onlyMine?: boolean;

  @ApiPropertyOptional({ description: '1-based page number. Omit for unpaginated results.', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page (default 10)', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
