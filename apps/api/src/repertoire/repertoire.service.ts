import { Injectable, NotFoundException } from '@nestjs/common';
import { Track, TrackSide, TrackStatus, MusicalKey } from '@nonsololarco/types';

import { PrismaService } from '../prisma';

@Injectable()
export class RepertoireService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUser(userId: string): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: { leadMemberId: userId },
      include: { leadMember: true, band: true },
      orderBy: { order: 'asc' },
    });

    return tracks.map((track) => ({
      id: track.id,
      order: track.order,
      title: track.title,
      side: track.side as TrackSide,
      musicalKey: track.musicalKey as MusicalKey,
      bpm: track.bpm,
      status: track.status as TrackStatus,
      duration: track.duration,
      leadMember: { id: track.leadMember.id, name: track.leadMember.name },
      band: { id: track.band.id, name: track.band.name },
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
      musicalKey: track.musicalKey as MusicalKey,
      bpm: track.bpm,
      status: track.status as TrackStatus,
      duration: track.duration,
      leadMember: { id: track.leadMember.id, name: track.leadMember.name },
    }));
  }
}
