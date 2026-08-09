import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
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

  @ApiPropertyOptional({
    enum: TrackFilterField,
    default: TrackFilterField.ALL,
  })
  @IsOptional()
  @IsEnum(TrackFilterField)
  status?: TrackFilterField;

  @ApiPropertyOptional({
    description: 'Show only tracks where current user participates',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return value as unknown;
  })
  onlyMine?: boolean;
}
