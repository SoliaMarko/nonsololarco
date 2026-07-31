import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { PrismaService } from '../prisma';
import { RepertoireService } from './repertoire.service';
import { createMockPrisma } from 'src/test/mocks/prisma.mock';

const mockTracks = [
  {
    id: 't-1',
    order: 1,
    title: 'Yard in the fog',
    side: 'a',
    musicalKey: 'Am',
    bpm: 68,
    status: 'ready',
    duration: '3:10',
    leadMemberId: 'user-1',
    bandId: 'band-1',
    leadMember: { id: 'user-1', name: 'Solomiia' },
    band: { id: 'band-1', name: 'Quiet Yard' },
  },
  {
    id: 't-2',
    order: 2,
    title: 'Walls of brick',
    side: 'a',
    musicalKey: 'Dm',
    bpm: 80,
    status: 'ready',
    duration: '2:55',
    leadMemberId: 'user-2',
    bandId: 'band-1',
    leadMember: { id: 'user-2', name: 'Anna' },
    band: { id: 'band-1', name: 'Quiet Yard' },
  },
];

describe('RepertoireService', () => {
  let service: RepertoireService;
  const mockPrisma = createMockPrisma();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RepertoireService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(RepertoireService);
    vi.clearAllMocks();
  });

  describe('getByUser', () => {
    it('returns tracks filtered by lead member', async () => {
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const tracks = await service.getByUser('user-1');

      expect(tracks).toHaveLength(1);
      expect(tracks[0].title).toBe('Yard in the fog');
      expect(tracks[0].leadMember.id).toBe('user-1');
    });

    it('includes band field on returned tracks', async () => {
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const tracks = await service.getByUser('user-1');

      expect(tracks[0].band).toEqual({ id: 'band-1', name: 'Quiet Yard' });
    });

    it('returns empty array for unknown user', async () => {
      mockPrisma.track.findMany.mockResolvedValue([]);

      const tracks = await service.getByUser('nonexistent');

      expect(tracks).toEqual([]);
    });

    it('queries with correct where and include', async () => {
      mockPrisma.track.findMany.mockResolvedValue([]);

      await service.getByUser('user-1');

      expect(mockPrisma.track.findMany).toHaveBeenCalledWith({
        where: { leadMemberId: 'user-1' },
        include: { leadMember: true, band: true },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('getByBand', () => {
    it('returns tracks without band field', async () => {
      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.findMany.mockResolvedValue(mockTracks);

      const tracks = await service.getByBand('band-1');

      tracks.forEach((track) => {
        expect(track).not.toHaveProperty('band');
      });
    });

    it('preserves all other track fields', async () => {
      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const tracks = await service.getByBand('band-1');

      expect(tracks[0]).toEqual({
        id: 't-1',
        order: 1,
        title: 'Yard in the fog',
        side: 'a',
        musicalKey: 'Am',
        bpm: 68,
        status: 'ready',
        duration: '3:10',
        leadMember: { id: 'user-1', name: 'Solomiia' },
      });
    });

    it('throws NotFoundException for unknown band', async () => {
      mockPrisma.band.findUnique.mockResolvedValue(null);

      await expect(service.getByBand('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('includes band id in error message', async () => {
      mockPrisma.band.findUnique.mockResolvedValue(null);

      await expect(service.getByBand('band-999')).rejects.toThrow(
        'Band with id band-999 not found',
      );
    });
  });
});
