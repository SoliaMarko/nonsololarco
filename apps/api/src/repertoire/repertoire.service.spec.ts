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
    performers: [],
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
    performers: [{ user: { id: 'user-1', name: 'Solomiia' } }],
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
      mockPrisma.track.count.mockResolvedValue(1);
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const result = await service.getByUser('user-1');

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Yard in the fog');
      expect(result.data[0].leadMember.id).toBe('user-1');
    });

    it('includes band field on returned tracks', async () => {
      mockPrisma.track.count.mockResolvedValue(1);
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const result = await service.getByUser('user-1');

      expect(result.data[0].band).toEqual({ id: 'band-1', name: 'Quiet Yard' });
    });

    it('returns empty array for unknown user', async () => {
      mockPrisma.track.count.mockResolvedValue(0);
      mockPrisma.track.findMany.mockResolvedValue([]);

      const result = await service.getByUser('nonexistent');

      expect(result.data).toEqual([]);
    });

    it('maps performers to members array', async () => {
      mockPrisma.track.count.mockResolvedValue(1);
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[1]]);

      const result = await service.getByUser('user-1');

      expect(result.data[0].members).toEqual([
        { id: 'user-1', name: 'Solomiia' },
      ]);
    });
  });

  describe('getByBand', () => {
    it('returns tracks without band field', async () => {
      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.count.mockResolvedValue(2);
      mockPrisma.track.findMany.mockResolvedValue(mockTracks);

      const result = await service.getByBand('band-1', 'user-1');

      result.data.forEach((track) => {
        expect(track).not.toHaveProperty('band');
      });
    });

    it('preserves all other track fields', async () => {
      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.count.mockResolvedValue(1);
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      const result = await service.getByBand('band-1', 'user-1');

      expect(result.data[0]).toEqual({
        id: 't-1',
        order: 1,
        title: 'Yard in the fog',
        side: 'a',
        musicalKey: 'Am',
        bpm: 68,
        status: 'ready',
        duration: '3:10',
        leadMember: { id: 'user-1', name: 'Solomiia' },
        members: [],
      });
    });

    it('throws NotFoundException for unknown band', async () => {
      mockPrisma.band.findUnique.mockResolvedValue(null);

      await expect(service.getByBand('nonexistent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('includes band id in error message', async () => {
      mockPrisma.band.findUnique.mockResolvedValue(null);

      await expect(service.getByBand('band-999', 'user-1')).rejects.toThrow(
        'Band with id band-999 not found',
      );
    });

    it('queries with correct where and include', async () => {
      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.count.mockResolvedValue(0);
      mockPrisma.track.findMany.mockResolvedValue([]);

      await service.getByBand('band-1', 'user-1');

      expect(mockPrisma.track.findMany).toHaveBeenCalledWith({
        where: { bandId: 'band-1' },
        include: {
          leadMember: true,
          performers: { include: { user: true } },
        },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      });
    });
  });

  describe('pagination', () => {
    it('returns full result set when page is omitted', async () => {
      mockPrisma.track.count.mockResolvedValue(2);
      mockPrisma.track.findMany.mockResolvedValue(mockTracks);

      const result = await service.getByUser('user-1');

      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.total).toBe(2);
      expect(result.totalPages).toBe(1);
    });

    it('passes skip and take to Prisma when paginated', async () => {
      mockPrisma.track.count.mockResolvedValue(25);
      mockPrisma.track.findMany.mockResolvedValue([mockTracks[0]]);

      await service.getByUser('user-1', { page: 2, pageSize: 10 });

      const callArgs = mockPrisma.track.findMany.mock.calls[0][0] as {
        skip?: number;
        take?: number;
      };
      expect(callArgs.skip).toBe(10);
      expect(callArgs.take).toBe(10);
    });

    it('defaults pageSize to 10', async () => {
      mockPrisma.track.count.mockResolvedValue(25);
      mockPrisma.track.findMany.mockResolvedValue([]);

      const result = await service.getByUser('user-1', { page: 1 });

      expect(result.pageSize).toBe(10);
    });

    it('slices in memory for post-query sort fields', async () => {
      const manyTracks = Array.from({ length: 15 }, (_, i) => ({
        ...mockTracks[0],
        id: `t-${i}`,
        order: i + 1,
        status: i < 5 ? 'new' : 'ready',
        duration: `${i}:00`,
      }));

      mockPrisma.band.findUnique.mockResolvedValue({ id: 'band-1' });
      mockPrisma.track.count.mockResolvedValue(15);
      mockPrisma.track.findMany.mockResolvedValue(manyTracks);

      const result = await service.getByBand('band-1', 'user-1', {
        sort: 'status' as never,
        page: 1,
        pageSize: 10,
      });

      expect(result.data).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.totalPages).toBe(2);
    });
  });
});
