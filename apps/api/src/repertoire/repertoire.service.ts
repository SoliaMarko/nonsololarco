import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@nonsololarco/db';
import {
  PaginatedResult,
  Track,
  TrackSide,
  TrackStatus,
} from '@nonsololarco/types';

import { PrismaService } from '../prisma';
import { toDisplayMusicalKey } from '../utils/musical-key.util';

import {
  SortOrder,
  TrackFilterField,
  TrackSortField,
} from './dto/sort-tracks.dto';

type OrderDir = 'asc' | 'desc';
type TrackOrderBy = Record<string, OrderDir>;

const DEFAULT_PAGE_SIZE = 10;

/** Status weight for sorting — lower value = earlier when ascending */
const STATUS_WEIGHT: Record<string, number> = {
  new: 0,
  learning: 1,
  ready: 2,
  archived: 3,
};

/** Parse "m:ss" duration string to total seconds for comparison */
function parseDuration(duration: string): number {
  const parts = duration.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0] ?? '0', 10);
  const seconds = parseInt(parts[1] ?? '0', 10);
  return (isNaN(minutes) ? 0 : minutes) * 60 + (isNaN(seconds) ? 0 : seconds);
}

function buildPrismaOrderBy(
  sort?: TrackSortField,
  order?: SortOrder,
): TrackOrderBy[] {
  const dir: OrderDir = order === SortOrder.DESC ? 'desc' : 'asc';

  switch (sort) {
    case TrackSortField.TRACK_ORDER:
      return [{ order: dir }, { id: 'asc' }];
    case TrackSortField.TITLE:
      return [{ title: dir }, { id: 'asc' }];
    case TrackSortField.BPM:
      return [{ bpm: dir }, { id: 'asc' }];
    case TrackSortField.STATUS:
    case TrackSortField.TIME:
      // Post-query sort — return empty so default ordering is used for Prisma
      return [];
    default:
      return [];
  }
}

function buildStatusFilter(filter?: TrackFilterField): object | undefined {
  switch (filter) {
    case TrackFilterField.READY:
      return { status: 'ready' };
    case TrackFilterField.LEARNING:
      return { status: 'learning' };
    case TrackFilterField.NEW:
      return { status: 'new' };
    case TrackFilterField.ARCHIVED:
      return { status: 'archived' };
    case TrackFilterField.ACTIVE:
      return { status: { in: ['ready', 'learning', 'new'] } };
    default:
      return undefined;
  }
}

function postQuerySort(
  tracks: Track[],
  sort?: TrackSortField,
  order?: SortOrder,
): Track[] {
  if (!sort) return tracks;

  const dir = order === SortOrder.DESC ? -1 : 1;

  if (sort === TrackSortField.STATUS) {
    return [...tracks].sort(
      (a, b) =>
        ((STATUS_WEIGHT[a.status] ?? 99) - (STATUS_WEIGHT[b.status] ?? 99)) *
        dir,
    );
  }

  if (sort === TrackSortField.TIME) {
    return [...tracks].sort(
      (a, b) => (parseDuration(a.duration) - parseDuration(b.duration)) * dir,
    );
  }

  return tracks;
}

// ---------------------------------------------------------------------------
// Pagination helpers
// ---------------------------------------------------------------------------

interface PaginationArgs {
  isPaginated: boolean;
  offset: number;
  page: number;
  pageSize: number;
}

/**
 * Resolves raw query params into deterministic pagination args.
 *
 * When `page` is omitted the endpoint is unpaginated — the full result set is
 * returned as a single page.
 */
function resolvePagination(page?: number, pageSize?: number): PaginationArgs {
  const isPaginated = page !== undefined;
  const resolvedPage = page ?? 1;
  const resolvedPageSize = isPaginated ? (pageSize ?? DEFAULT_PAGE_SIZE) : 0;
  return {
    isPaginated,
    offset: isPaginated ? (resolvedPage - 1) * resolvedPageSize : 0,
    page: resolvedPage,
    pageSize: resolvedPageSize,
  };
}

/**
 * Builds the pagination envelope metadata from total count and pagination args.
 */
function buildMeta(
  total: number,
  pa: PaginationArgs,
): Omit<PaginatedResult<never>, 'data'> {
  const pageSize = pa.isPaginated ? pa.pageSize : total;
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;
  return { page: pa.page, pageSize, total, totalPages };
}

/**
 * Slices a fully-sorted in-memory array to the requested page.
 *
 * Used only for post-query sort fields (status, time) where the entire result
 * set must be loaded and sorted before pagination can be applied.
 */
function applyPageSlice<T>(items: T[], pa: PaginationArgs): T[] {
  if (!pa.isPaginated) return items;
  return items.slice(pa.offset, pa.offset + pa.pageSize);
}

/**
 * Returns true when the sort field requires in-memory sorting.
 *
 * TODO: eliminate the full-table load by making these fields sortable at the
 * DB level — store duration as an integer `durationSeconds` column and map
 * status to a sortable integer column. Until then the in-memory path loads
 * every matching track on each page request, so cost grows linearly with
 * repertoire size.
 */
function isPostQuerySortField(sort?: TrackSortField): boolean {
  return sort === TrackSortField.STATUS || sort === TrackSortField.TIME;
}

/** Prisma include for loading lead member and performers */
const TRACK_INCLUDE_MEMBERS = {
  leadMember: true,
  performers: { include: { user: true } },
} as const;

/** Prisma include for loading lead member, performers, and band */
const TRACK_INCLUDE_ALL = {
  ...TRACK_INCLUDE_MEMBERS,
  band: true,
} as const;

/** Where clause: tracks the user participates in (as lead or performer) */
function participatesIn(userId: string): object {
  return {
    OR: [{ leadMemberId: userId }, { performers: { some: { userId } } }],
  };
}

type TrackWithMembers = Prisma.TrackGetPayload<{
  include: typeof TRACK_INCLUDE_MEMBERS;
}>;
type TrackWithAll = Prisma.TrackGetPayload<{
  include: typeof TRACK_INCLUDE_ALL;
}>;
type TrackRow = TrackWithMembers | TrackWithAll;

function mapTrack(track: TrackRow, includeBand = false): Track {
  const band = 'band' in track ? track.band : null;

  return {
    id: track.id,
    order: track.order,
    title: track.title,
    side: track.side as TrackSide,
    musicalKey: toDisplayMusicalKey(track.musicalKey) as Track['musicalKey'],
    bpm: track.bpm,
    status: track.status as TrackStatus,
    duration: track.duration,
    leadMember: { id: track.leadMember.id, name: track.leadMember.name },
    members: track.performers.map((p) => ({
      id: p.user.id,
      name: p.user.name,
    })),
    ...(includeBand && band ? { band: { id: band.id, name: band.name } } : {}),
  };
}

export interface RepertoireQueryOptions {
  onlyMine?: boolean;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
  sort?: TrackSortField;
  status?: TrackFilterField;
}

interface FindTracksArgs {
  defaultOrderBy: TrackOrderBy[];
  include: typeof TRACK_INCLUDE_ALL | typeof TRACK_INCLUDE_MEMBERS;
  includeBand: boolean;
  options: RepertoireQueryOptions;
  where: Prisma.TrackWhereInput;
}

@Injectable()
export class RepertoireService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all tracks the user participates in (as lead or performer),
   * across all bands and solo repertoire. Includes band info on each track.
   */
  async getByUser(
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<PaginatedResult<Track>> {
    return this.findTracks({
      defaultOrderBy: [{ bandId: 'asc' }, { order: 'asc' }, { id: 'asc' }],
      include: TRACK_INCLUDE_ALL,
      includeBand: true,
      options,
      where: {
        ...participatesIn(userId),
        ...buildStatusFilter(options.status),
      },
    });
  }

  /**
   * Returns solo tracks owned by the user (bandId is null).
   * Solo tracks have no band association — only lead member and performers.
   */
  async getSoloByUser(
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<PaginatedResult<Track>> {
    return this.findTracks({
      defaultOrderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: TRACK_INCLUDE_MEMBERS,
      includeBand: false,
      options,
      where: {
        bandId: { equals: null },
        leadMemberId: userId,
        ...buildStatusFilter(options.status),
      },
    });
  }

  /**
   * Returns tracks belonging to a specific band.
   * When `onlyMine` is set, filters to tracks the user participates in.
   *
   * @throws NotFoundException when the band does not exist.
   */
  async getByBand(
    bandId: string,
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<PaginatedResult<Track>> {
    const band = await this.prisma.band.findUnique({
      where: { id: bandId },
    });

    if (!band) {
      throw new NotFoundException(`Band with id ${bandId} not found`);
    }

    return this.findTracks({
      defaultOrderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: TRACK_INCLUDE_MEMBERS,
      includeBand: false,
      options,
      where: {
        bandId,
        ...(options.onlyMine ? participatesIn(userId) : {}),
        ...buildStatusFilter(options.status),
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Core query pipeline
  // ---------------------------------------------------------------------------

  /**
   * Executes a track query with sorting, filtering, and pagination.
   *
   * Fields `status` and `time` are not sortable at the DB level, so for them
   * the full matching set is loaded and sorted/sliced in memory — see
   * `isPostQuerySortField`.
   */
  private async findTracks(args: FindTracksArgs): Promise<PaginatedResult<Track>> {
    const { defaultOrderBy, include, includeBand, options, where } = args;
    const { sort, order, page, pageSize } = options;

    const orderBy = buildPrismaOrderBy(sort, order);
    const pa = resolvePagination(page, pageSize);
    const needsPostSort = isPostQuerySortField(sort);

    const total = await this.prisma.track.count({ where });

    const tracks = await this.prisma.track.findMany({
      where,
      include,
      orderBy: orderBy.length ? orderBy : defaultOrderBy,
      ...(pa.isPaginated && !needsPostSort
        ? { skip: pa.offset, take: pa.pageSize }
        : {}),
    });

    const mapped = tracks.map((track) => mapTrack(track, includeBand));
    const sorted = postQuerySort(mapped, sort, order);
    const data = needsPostSort ? applyPageSlice(sorted, pa) : sorted;

    return { data, ...buildMeta(total, pa) };
  }
}
