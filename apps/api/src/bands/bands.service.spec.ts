import { MOCK_ALL_REPERTOIRE } from '../mocks/repertoire.mock';
import { sumDurations } from '../utils/duration.util';
import { MOCK_BANDS } from '../mocks/bands.mock';
import { BandsService } from './bands.service';

describe('BandsService', () => {
  const service = new BandsService();

  describe('getByUser', () => {
    it('returns one entry per band seed', () => {
      const bands = service.getByUser('any-user');

      expect(bands).toHaveLength(MOCK_BANDS.length);
    });

    it('preserves static band metadata', () => {
      const bands = service.getByUser('any-user');

      bands.forEach((band, index) => {
        expect(band.id).toBe(MOCK_BANDS[index].id);
        expect(band.name).toBe(MOCK_BANDS[index].name);
        expect(band.role).toBe(MOCK_BANDS[index].role);
      });
    });

    it('computes totalTracks from repertoire data', () => {
      const bands = service.getByUser('any-user');

      bands.forEach((band) => {
        const expected = MOCK_ALL_REPERTOIRE.filter(
          (t) => t.band?.id === band.id,
        ).length;

        expect(band.totalTracks).toBe(expected);
      });
    });

    it('computes readyTracks from repertoire data', () => {
      const bands = service.getByUser('any-user');

      bands.forEach((band) => {
        const expected = MOCK_ALL_REPERTOIRE.filter(
          (t) => t.band?.id === band.id && t.status === 'ready',
        ).length;

        expect(band.readyTracks).toBe(expected);
      });
    });

    it('computes totalDuration from repertoire data', () => {
      const bands = service.getByUser('any-user');

      bands.forEach((band) => {
        const durations = MOCK_ALL_REPERTOIRE.filter(
          (t) => t.band?.id === band.id,
        ).map((t) => t.duration);

        expect(band.totalDuration).toBe(sumDurations(durations));
      });
    });

    it('returns correct stats for Quiet Yard (band-1)', () => {
      const bands = service.getByUser('any-user');
      const quietYard = bands.find((b) => b.id === 'band-1');

      expect(quietYard).toBeDefined();
      expect(quietYard!.totalTracks).toBe(6);
      expect(quietYard!.readyTracks).toBe(5);
      expect(quietYard!.totalDuration).toBe('19 min');
    });

    it('returns correct stats for Jellyfish with zero ready tracks (band-6)', () => {
      const bands = service.getByUser('any-user');
      const jellyfish = bands.find((b) => b.id === 'band-6');

      expect(jellyfish).toBeDefined();
      expect(jellyfish!.totalTracks).toBe(2);
      expect(jellyfish!.readyTracks).toBe(0);
    });

    it('returns all required Band fields', () => {
      const bands = service.getByUser('any-user');

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
