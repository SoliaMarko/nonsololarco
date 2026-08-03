import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackSide, TrackStatus } from '@nonsololarco/types';

import { PrismaService } from '../prisma';
import { toDisplayMusicalKey } from '../utils/musical-key.util';

import { SortOrder, TrackSortField } from './dto/sort-tracks.dto';

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
  const dir: OrderDir = order === 'desc' ? 'desc' : 'asc';

  switch (sort) {
    case TrackSortField.TRACK_ORDER:
      return [{ order: dir }];
    case TrackSortField.TITLE:
      return [{ title: dir }];
    case TrackSortField.BPM:
      return [{ bpm: dir }];
    case TrackSortField.STATUS:
      // Status is an enum — Prisma sorts by definition order, not by our weight.
      // Post-query sort handles the correct order.
      return [];
    case TrackSortField.TIME:
      // Duration is stored as "m:ss" string — needs post-query sort.
      return [];
    default:
      return [];
  }
}

function postQuerySort(
  tracks: Track[],
  sort?: TrackSortField,
  order?: SortOrder,
): Track[] {
  if (!sort) return tracks;

  const dir = order === 'desc' ? -1 : 1;

  if (sort === TrackSortField.STATUS) {
    return [...tracks].sort(
      (a, b) => ((STATUS_WEIGHT[a.status] ?? 99) - (STATUS_WEIGHT[b.status] ?? 99)) * dir,
    );
  }

  if (sort === TrackSortField.TIME) {
    return [...tracks].sort(
      (a, b) => (parseDuration(a.duration) - parseDuration(b.duration)) * dir,
    );
  }

  return tracks;
}

@Injectable()
export class RepertoireService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUser(userId: string, sort?: TrackSortField, order?: SortOrder): Promise<Track[]> {
    const orderBy = buildPrismaOrderBy(sort, order);

    const tracks = await this.prisma.track.findMany({
      where: { leadMemberId: userId },
      include: { leadMember: true, band: true },
      orderBy: orderBy.length ? orderBy : [{ bandId: 'asc' }, { order: 'asc' }],
    });

    const mapped = tracks.map((track) => ({
      id: track.id,
      order: track.order,
      title: track.title,
      side: track.side as TrackSide,
      musicalKey: toDisplayMusicalKey(track.musicalKey) as Track['musicalKey'],
      bpm: track.bpm,
      status: track.status as TrackStatus,
      duration: track.duration,
      leadMember: { id: track.leadMember.id, name: track.leadMember.name },
      band: track.band ? { id: track.band.id, name: track.band.name } : undefined,
    }));

    return postQuerySort(mapped, sort, order);
  }

  async getSoloByUser(userId: string, sort?: TrackSortField, order?: SortOrder): Promise<Track[]> {
    const orderBy = buildPrismaOrderBy(sort, order);

    const tracks = await this.prisma.track.findMany({
      where: { leadMemberId: userId, bandId: { equals: null } },
      include: { leadMember: true, band: true },
      orderBy: orderBy.length ? orderBy : [{ order: 'asc' }],
    });

    const mapped = tracks.map((track) => ({
      id: track.id,
      order: track.order,
      title: track.title,
      side: track.side as TrackSide,
      musicalKey: toDisplayMusicalKey(track.musicalKey) as Track['musicalKey'],
      bpm: track.bpm,
      status: track.status as TrackStatus,
      duration: track.duration,
      leadMember: { id: track.leadMember.id, name: track.leadMember.name },
    }));

    return postQuerySort(mapped, sort, order);
  }

  async getByBand(bandId: string, sort?: TrackSortField, order?: SortOrder): Promise<Track[]> {
    const band = await this.prisma.band.findUnique({
      where: { id: bandId },
    });

    if (!band) {
      throw new NotFoundException(`Band with id ${bandId} not found`);
    }

    const orderBy = buildPrismaOrderBy(sort, order);

    const tracks = await this.prisma.track.findMany({
      where: { bandId },
      include: { leadMember: true },
      orderBy: orderBy.length ? orderBy : [{ order: 'asc' }],
    });

    const mapped = tracks.map((track) => ({
      id: track.id,
      order: track.order,
      title: track.title,
      side: track.side as TrackSide,
      musicalKey: toDisplayMusicalKey(track.musicalKey) as Track['musicalKey'],
      bpm: track.bpm,
      status: track.status as TrackStatus,
      duration: track.duration,
      leadMember: { id: track.leadMember.id, name: track.leadMember.name },
    }));

    return postQuerySort(mapped, sort, order);
  }
}
