import { NotFoundException } from '@nestjs/common';

import {
  MOCK_ALL_REPERTOIRE,
  MOCK_CURRENT_USER_ID,
} from '../mocks/repertoire.mock';
import { RepertoireService } from './repertoire.service';

describe('RepertoireService', () => {
  const service = new RepertoireService();

  describe('getByUser', () => {
    it('returns only tracks where the user is lead member', () => {
      const tracks = service.getByUser(MOCK_CURRENT_USER_ID);

      expect(tracks.length).toBeGreaterThan(0);
      expect(
        tracks.every((t) => t.leadMember.id === MOCK_CURRENT_USER_ID),
      ).toBe(true);
    });

    it('returns correct count for mock user', () => {
      const tracks = service.getByUser(MOCK_CURRENT_USER_ID);

      const expected = MOCK_ALL_REPERTOIRE.filter(
        (t) => t.leadMember?.id === MOCK_CURRENT_USER_ID,
      ).length;

      expect(tracks).toHaveLength(expected);
    });

    it('returns empty array for unknown user', () => {
      const tracks = service.getByUser('nonexistent-user');

      expect(tracks).toEqual([]);
    });

    it('preserves band field on returned tracks', () => {
      const tracks = service.getByUser(MOCK_CURRENT_USER_ID);

      const withBand = tracks.filter((t) => t.band);
      expect(withBand.length).toBeGreaterThan(0);
      expect(withBand[0].band).toHaveProperty('id');
      expect(withBand[0].band).toHaveProperty('name');
    });
  });

  describe('getByBand', () => {
    it('returns all tracks for a given band', () => {
      const tracks = service.getByBand('band-1');

      const expected = MOCK_ALL_REPERTOIRE.filter(
        (t) => t.band?.id === 'band-1',
      ).length;

      expect(tracks).toHaveLength(expected);
    });

    it('strips the band field from returned tracks', () => {
      const tracks = service.getByBand('band-1');

      tracks.forEach((track) => {
        expect(track).not.toHaveProperty('band');
      });
    });

    it('preserves all other track fields', () => {
      const tracks = service.getByBand('band-1');

      tracks.forEach((track) => {
        expect(track).toHaveProperty('id');
        expect(track).toHaveProperty('title');
        expect(track).toHaveProperty('leadMember');
        expect(track).toHaveProperty('musicalKey');
        expect(track).toHaveProperty('bpm');
        expect(track).toHaveProperty('status');
        expect(track).toHaveProperty('duration');
      });
    });

    it('throws NotFoundException for unknown band', () => {
      expect(() => service.getByBand('nonexistent-band')).toThrow(
        NotFoundException,
      );
    });

    it('includes the band id in the error message', () => {
      expect(() => service.getByBand('band-999')).toThrow(
        'Band with id band-999 not found',
      );
    });
  });
});
