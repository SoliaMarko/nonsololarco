import { Injectable } from '@nestjs/common';
import { Band } from '@nonsololarco/types';

import { PrismaService } from '../prisma';
import { sumDurations } from 'src/utils/duration.util';

@Injectable()
export class BandsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string): Promise<Band[]> {
    const memberships = await this.prisma.bandMember.findMany({
      where: { userId },
      include: {
        band: {
          include: {
            tracks: { select: { status: true, duration: true } },
          },
        },
      },
      orderBy: { band: { name: 'asc' } },
    });

    return memberships.map(({ role, band }) => ({
      id: band.id,
      name: band.name,
      role,
      totalTracks: band.tracks.length,
      readyTracks: band.tracks.filter((t) => t.status === 'ready').length,
      totalDuration: sumDurations(band.tracks.map((t) => t.duration)),
    }));
  }
}
