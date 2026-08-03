import { Test } from '@nestjs/testing';

import { PrismaService } from '../prisma';
import { createMockPrisma } from 'src/test/mocks/prisma.mock';
import { BandsService } from './bands.service';

const mockMemberships = [
  {
    role: 'back vocal',
    band: {
      id: 'band-1',
      name: 'Quiet Yard',
      tracks: [
        { status: 'ready', duration: '3:10' },
        { status: 'ready', duration: '2:55' },
        { status: 'ready', duration: '3:05' },
        { status: 'ready', duration: '3:40' },
        { status: 'ready', duration: '3:15' },
        { status: 'learning', duration: '3:00' },
      ],
    },
  },
  {
    role: 'covers',
    band: {
      id: 'band-6',
      name: 'Jellyfish',
      tracks: [
        { status: 'new', duration: '5:10' },
        { status: 'learning', duration: '4:50' },
      ],
    },
  },
];

describe('BandsService', () => {
  let service: BandsService;
  const mockPrisma = createMockPrisma();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BandsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get(BandsService);
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns one entry per membership', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      expect(bands).toHaveLength(2);
    });

    it('uses role from membership, not from band', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      expect(bands[0].role).toBe('back vocal');
      expect(bands[1].role).toBe('covers');
    });

    it('computes totalTracks from band tracks', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      expect(bands[0].totalTracks).toBe(6);
      expect(bands[1].totalTracks).toBe(2);
    });

    it('computes readyTracks correctly', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      expect(bands[0].readyTracks).toBe(5);
      expect(bands[1].readyTracks).toBe(0);
    });

    it('computes totalDuration from track durations', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      expect(bands[0].totalDuration).toBe('19 min');
      expect(bands[1].totalDuration).toBe('10 min');
    });

    it('queries with correct where and include', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue([]);

      await service.getAll('user-1');

      expect(mockPrisma.bandMember.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          band: {
            include: {
              tracks: { select: { status: true, duration: true } },
            },
          },
        },
        orderBy: { band: { name: 'asc' } },
      });
    });

    it('returns empty array when user has no bands', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue([]);

      const bands = await service.getAll('user-1');

      expect(bands).toEqual([]);
    });

    it('returns all required Band fields', async () => {
      mockPrisma.bandMember.findMany.mockResolvedValue(mockMemberships);

      const bands = await service.getAll('user-1');

      bands.forEach((band) => {
        expect(band).toHaveProperty('id');
        expect(band).toHaveProperty('name');
        expect(band).toHaveProperty('role');
        expect(band).toHaveProperty('totalTracks');
        expect(band).toHaveProperty('readyTracks');
        expect(band).toHaveProperty('totalDuration');
      });
    });
  });
});
