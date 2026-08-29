/**
 * Integration tests for RepertoireService against a real PostgreSQL database.
 *
 * These tests verify behaviour that unit tests with mocked Prisma cannot:
 * - actual sort order from the database
 * - pagination boundaries (skip/take)
 * - status filter semantics (especially "active" = ready|learning|new)
 * - solo vs band track separation
 * - MusicalKey round-trip mapping (Prisma enum ↔ display notation)
 */
import { getTestPrisma, setupIntegration } from 'src/test/setup-integration';
import {
  seedFixtures,
  BAND_QUIET_YARD,
  TRACK_BAND_1,
  TRACK_BAND_2,
  TRACK_SOLO_1,
  TRACK_SOLO_2,
  USER_SOLOMIIA,
} from 'src/test/fixtures/seed-fixtures';
import { RepertoireService } from './repertoire.service';
import {
  SortOrder,
  TrackFilterField,
  TrackSortField,
} from './dto/sort-tracks.dto';

setupIntegration();

// RepertoireService expects PrismaService (which extends PrismaClient),
// but only uses Prisma methods — a plain PrismaClient works fine here.
let service: RepertoireService;

beforeEach(async () => {
  const prisma = getTestPrisma();
  await seedFixtures(prisma);

  // Cast is safe: RepertoireService only calls prisma.track.* and
  // prisma.band.* — no NestJS lifecycle methods.
  service = new RepertoireService(prisma as any);
});

// ---------------------------------------------------------------------------
// 1. Default sort order
// ---------------------------------------------------------------------------

describe('getByBand — sort order', () => {
  it('returns tracks sorted by order ASC by default', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

    const titles = result.data.map((t) => t.title);
    expect(titles).toEqual([
      'Yard in the fog',
      'Walls of brick',
      'Archived melody',
    ]);
  });

  it('sorts by title when requested', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      sort: TrackSortField.TITLE,
      order: SortOrder.ASC,
    });

    const titles = result.data.map((t) => t.title);
    expect(titles).toEqual([
      'Archived melody',
      'Walls of brick',
      'Yard in the fog',
    ]);
  });

  it('sorts by BPM descending', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      sort: TrackSortField.BPM,
      order: SortOrder.DESC,
    });

    const bpms = result.data.map((t) => t.bpm);
    expect(bpms).toEqual([120, 80, 68]);
  });

  // Time sorting used to happen in memory because duration was the string
  // "m:ss". These two cases are the reason durationSeconds exists: they pass
  // only if Postgres is doing the ordering.
  it('sorts by time ascending in the database', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      sort: TrackSortField.TIME,
      order: SortOrder.ASC,
    });

    expect(result.data.map((t) => t.durationSeconds)).toEqual([175, 190, 240]);
  });

  it('sorts by time descending in the database', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      sort: TrackSortField.TIME,
      order: SortOrder.DESC,
    });

    expect(result.data.map((t) => t.durationSeconds)).toEqual([240, 190, 175]);
  });

  it('paginates a time-sorted list without loading the whole table', async () => {
    // With the old string column this path loaded every matching row and
    // sliced in memory. Now skip/take run in SQL, so page 2 of a 1-per-page
    // sort must be the second shortest track and nothing else.
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      sort: TrackSortField.TIME,
      order: SortOrder.ASC,
      page: 2,
      pageSize: 1,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.durationSeconds).toBe(190);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 2. Pagination boundaries
// ---------------------------------------------------------------------------

describe('getByBand — pagination', () => {
  it('returns page 1 with correct metadata', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      page: 1,
      pageSize: 2,
    });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(3);
    expect(result.totalPages).toBe(2);
    expect(result.page).toBe(1);
  });

  it('returns last page with remaining items', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      page: 2,
      pageSize: 2,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Archived melody');
  });

  it('returns empty data for page beyond range', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      page: 99,
      pageSize: 2,
    });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(3);
  });

  it('returns full result set when page is omitted', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

    expect(result.data).toHaveLength(3);
    expect(result.totalPages).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 3. Status filter — especially "active" = ready|learning|new
// ---------------------------------------------------------------------------

describe('getByBand — status filter', () => {
  it('filters by active status (ready + learning + new, not archived)', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      status: TrackFilterField.ACTIVE,
    });

    const statuses = result.data.map((t) => t.status);
    expect(statuses).not.toContain('archived');
    expect(result.data).toHaveLength(2);
  });

  it('filters by single status', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA, {
      status: TrackFilterField.LEARNING,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Walls of brick');
  });
});

// ---------------------------------------------------------------------------
// 4. Solo vs band separation
// ---------------------------------------------------------------------------

describe('getSoloByUser vs getByBand', () => {
  it('getSoloByUser returns only tracks without a band', async () => {
    const result = await service.getSoloByUser(USER_SOLOMIIA);

    expect(result.data).toHaveLength(2);
    result.data.forEach((track) => {
      expect(track).not.toHaveProperty('band');
    });
    const ids = result.data.map((t) => t.id);
    expect(ids).toContain(TRACK_SOLO_1);
    expect(ids).toContain(TRACK_SOLO_2);
  });

  it('getByBand does not return solo tracks', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

    const ids = result.data.map((t) => t.id);
    expect(ids).not.toContain(TRACK_SOLO_1);
    expect(ids).not.toContain(TRACK_SOLO_2);
  });

  it('getByUser returns both band and solo tracks', async () => {
    const result = await service.getByUser(USER_SOLOMIIA);

    const ids = result.data.map((t) => t.id);
    // Band tracks where Solomiia is lead or performer
    expect(ids).toContain(TRACK_BAND_1);
    expect(ids).toContain(TRACK_BAND_2);
    // Solo tracks
    expect(ids).toContain(TRACK_SOLO_1);
    expect(ids).toContain(TRACK_SOLO_2);
  });
});

// ---------------------------------------------------------------------------
// 5. MusicalKey round-trip mapping
// ---------------------------------------------------------------------------

describe('MusicalKey mapping', () => {
  it('maps CSharp enum to C# display notation', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

    const wallsOfBrick = result.data.find((t) => t.id === TRACK_BAND_2);
    // Stored as MusicalKey.CSharp in Prisma, displayed as "C#"
    expect(wallsOfBrick?.musicalKey).toBe('C#');
  });

  it('maps plain keys without transformation', async () => {
    const result = await service.getByBand(BAND_QUIET_YARD, USER_SOLOMIIA);

    const yardInTheFog = result.data.find((t) => t.id === TRACK_BAND_1);
    expect(yardInTheFog?.musicalKey).toBe('Am');
  });
});
