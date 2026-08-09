import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackSide, TrackStatus } from '@nonsololarco/types';

import { PrismaService } from '../prisma';
import { toDisplayMusicalKey } from '../utils/musical-key.util';

import {
  SortOrder,
  TrackFilterField,
  TrackSortField,
} from './dto/sort-tracks.dto';

type OrderDir = 'asc' | 'desc';
type TrackOrderBy = Record<string, OrderDir>;

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
      return [{ order: dir }];
    case TrackSortField.TITLE:
      return [{ title: dir }];
    case TrackSortField.BPM:
      return [{ bpm: dir }];
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

interface TrackRow {
  band?: { id: string; name: string } | null;
  bpm: number;
  duration: string;
  id: string;
  leadMember: { id: string; name: string };
  musicalKey: Parameters<typeof toDisplayMusicalKey>[0];
  order: number;
  performers: { user: { id: string; name: string } }[];
  side: string;
  status: string;
  title: string;
}

function mapTrack(track: TrackRow, includeBand = false): Track {
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
    ...(includeBand && track.band
      ? { band: { id: track.band.id, name: track.band.name } }
      : {}),
  };
}

export interface RepertoireQueryOptions {
  onlyMine?: boolean;
  order?: SortOrder;
  sort?: TrackSortField;
  status?: TrackFilterField;
}

@Injectable()
export class RepertoireService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUser(
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<Track[]> {
    const { sort, order, status } = options;
    const orderBy = buildPrismaOrderBy(sort, order);
    const statusFilter = buildStatusFilter(status);

    const tracks = await this.prisma.track.findMany({
      where: {
        ...participatesIn(userId),
        ...statusFilter,
      },
      include: TRACK_INCLUDE_ALL,
      orderBy: orderBy.length ? orderBy : [{ bandId: 'asc' }, { order: 'asc' }],
    });

    const mapped = tracks.map((track) => mapTrack(track, true));
    return postQuerySort(mapped, sort, order);
  }

  async getSoloByUser(
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<Track[]> {
    const { sort, order, status } = options;
    const orderBy = buildPrismaOrderBy(sort, order);
    const statusFilter = buildStatusFilter(status);

    const tracks = await this.prisma.track.findMany({
      where: {
        leadMemberId: userId,
        bandId: { equals: null },
        ...statusFilter,
      },
      include: TRACK_INCLUDE_MEMBERS,
      orderBy: orderBy.length ? orderBy : [{ order: 'asc' }],
    });

    const mapped = tracks.map((track) => mapTrack(track));
    return postQuerySort(mapped, sort, order);
  }

  async getByBand(
    bandId: string,
    userId: string,
    options: RepertoireQueryOptions = {},
  ): Promise<Track[]> {
    const { sort, order, status, onlyMine } = options;

    const band = await this.prisma.band.findUnique({
      where: { id: bandId },
    });

    if (!band) {
      throw new NotFoundException(`Band with id ${bandId} not found`);
    }

    const orderBy = buildPrismaOrderBy(sort, order);
    const statusFilter = buildStatusFilter(status);

    const tracks = await this.prisma.track.findMany({
      where: {
        bandId,
        ...(onlyMine ? participatesIn(userId) : {}),
        ...statusFilter,
      },
      include: TRACK_INCLUDE_MEMBERS,
      orderBy: orderBy.length ? orderBy : [{ order: 'asc' }],
    });

    const mapped = tracks.map((track) => mapTrack(track));
    return postQuerySort(mapped, sort, order);
  }
}
