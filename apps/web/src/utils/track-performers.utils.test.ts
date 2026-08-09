import { describe, expect, it } from 'vitest';

import { Track } from '@nonsololarco/types';

import { getTrackPerformers, shouldHighlightLead } from './track-performers.utils';

const ANNA = { id: 'u-anna', name: 'Anna' };
const SOLOMIIA = { id: 'u-solomiia', name: 'Solomiia' };
const JARED = { id: 'u-jared', name: 'Jared' };

function track(
  leadMember: Track['leadMember'],
  members: Track['members'] = [],
): Pick<Track, 'leadMember' | 'members'> {
  return { leadMember, members };
}

describe('getTrackPerformers', () => {
  it('returns the lead alone when there are no other performers', () => {
    expect(getTrackPerformers(track(ANNA))).toEqual([{ ...ANNA, isLead: true }]);
  });

  it('flags only the lead', () => {
    const performers = getTrackPerformers(track(ANNA, [SOLOMIIA, JARED]));

    expect(performers.filter((p) => p.isLead)).toEqual([{ ...ANNA, isLead: true }]);
  });

  it('keeps lead-first order when no current user is given', () => {
    const performers = getTrackPerformers(track(ANNA, [SOLOMIIA, JARED]));

    expect(performers.map((p) => p.name)).toEqual(['Anna', 'Solomiia', 'Jared']);
  });

  it('moves the current user to the front', () => {
    const performers = getTrackPerformers(track(ANNA, [SOLOMIIA, JARED]), SOLOMIIA.id);

    expect(performers.map((p) => p.name)).toEqual(['Solomiia', 'Anna', 'Jared']);
  });

  it('preserves the relative order of the remaining performers', () => {
    const performers = getTrackPerformers(track(ANNA, [SOLOMIIA, JARED]), JARED.id);

    expect(performers.map((p) => p.name)).toEqual(['Jared', 'Anna', 'Solomiia']);
  });

  it('keeps the current user first when they are already the lead', () => {
    const performers = getTrackPerformers(track(SOLOMIIA, [ANNA]), SOLOMIIA.id);

    expect(performers.map((p) => p.name)).toEqual(['Solomiia', 'Anna']);
    expect(performers[0]?.isLead).toBe(true);
  });

  it('leaves order untouched when the current user is not on the track', () => {
    const performers = getTrackPerformers(track(ANNA, [JARED]), 'u-stranger');

    expect(performers.map((p) => p.name)).toEqual(['Anna', 'Jared']);
  });

  it('lists a performer who is also the lead only once', () => {
    const performers = getTrackPerformers(track(ANNA, [ANNA, JARED]));

    expect(performers.map((p) => p.name)).toEqual(['Anna', 'Jared']);
    expect(performers[0]?.isLead).toBe(true);
  });

  it('tolerates a missing members array', () => {
    const performers = getTrackPerformers({
      leadMember: ANNA,
    } as Pick<Track, 'leadMember' | 'members'>);

    expect(performers).toEqual([{ ...ANNA, isLead: true }]);
  });

  it('does not mutate the input track', () => {
    const input = track(ANNA, [SOLOMIIA]);

    getTrackPerformers(input, SOLOMIIA.id);

    expect(input.members).toEqual([SOLOMIIA]);
    expect(input.leadMember).toEqual(ANNA);
  });
});

describe('shouldHighlightLead', () => {
  it('is false for a single performer — nothing to contrast against', () => {
    expect(shouldHighlightLead(getTrackPerformers(track(ANNA)))).toBe(false);
  });

  it('is true once a second performer exists', () => {
    expect(shouldHighlightLead(getTrackPerformers(track(ANNA, [JARED])))).toBe(true);
  });

  it('is false for an empty list', () => {
    expect(shouldHighlightLead([])).toBe(false);
  });
});
