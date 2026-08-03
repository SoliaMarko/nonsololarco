-- Fail with a clear message instead of a cryptic unique-violation error if
-- any target database already has duplicate (band_id, "order") pairs — the
-- CREATE UNIQUE INDEX below would otherwise fail with little context on
-- which rows need fixing.
DO $$
DECLARE
  dupe_count integer;
BEGIN
  SELECT count(*) INTO dupe_count FROM (
    SELECT "band_id", "order"
    FROM "tracks"
    GROUP BY "band_id", "order"
    HAVING count(*) > 1
  ) AS dupes;

  IF dupe_count > 0 THEN
    RAISE EXCEPTION 'Cannot add unique constraint on tracks(band_id, "order"): % band(s) have tracks sharing the same position. Fix duplicate positions before re-running this migration.', dupe_count;
  END IF;
END $$;

-- DropIndex
-- Superseded by the composite unique index below: (band_id, order) also
-- covers plain "filter by band_id" lookups via the leftmost-prefix rule.
DROP INDEX "tracks_band_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "tracks_band_id_order_key" ON "tracks"("band_id", "order");
