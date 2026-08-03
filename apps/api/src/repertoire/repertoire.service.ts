import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackSide, TrackStatus } from '@nonsololarco/types';

import { PrismaService } from '../prisma';
import { toDisplayMusicalKey } from '../utils/musical-key.util';

@Injectable()
export class RepertoireService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUser(userId: string): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: { leadMemberId: userId },
      include: { leadMember: true, band: true },
      orderBy: [{ bandId: 'asc' }, { order: 'asc' }],
    });

    return tracks.map((track) => ({
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
  }

  async getSoloByUser(userId: string): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: { leadMemberId: userId, bandId: { equals: null } },
      include: { leadMember: true, band: true },
      orderBy: { order: 'asc' },
    });

    return tracks.map((track) => ({
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
  }

  async getByBand(bandId: string): Promise<Track[]> {
    const band = await this.prisma.band.findUnique({
      where: { id: bandId },
    });

    if (!band) {
      throw new NotFoundException(`Band with id ${bandId} not found`);
    }

    const tracks = await this.prisma.track.findMany({
      where: { bandId },
      include: { leadMember: true },
      orderBy: { order: 'asc' },
    });

    return tracks.map((track) => ({
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
  }
}
