-- Convert Track.duration ("m:ss" text) into an integer seconds column.
--
-- Done in four steps so the backfill runs against real data before the old
-- column is dropped. Wrapped in a single migration => single transaction, so
-- a failure at any step rolls the whole thing back.

-- Step 1: add the new column as nullable so existing rows stay valid.
ALTER TABLE "tracks" ADD COLUMN "duration_seconds" INTEGER;

-- Step 2: backfill from the legacy "m:ss" text.
-- Rows that do not match the expected shape fall back to 0 rather than
-- aborting the migration.
UPDATE "tracks"
SET "duration_seconds" = CASE
  WHEN "duration" ~ '^[0-9]+:[0-5][0-9]$'
    THEN SPLIT_PART("duration", ':', 1)::INTEGER * 60
       + SPLIT_PART("duration", ':', 2)::INTEGER
  ELSE 0
END;

-- Step 3: every row is populated now, so enforce NOT NULL.
ALTER TABLE "tracks" ALTER COLUMN "duration_seconds" SET NOT NULL;

-- Step 4: drop the legacy column.
ALTER TABLE "tracks" DROP COLUMN "duration";
