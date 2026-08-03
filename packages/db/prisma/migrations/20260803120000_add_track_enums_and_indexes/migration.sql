-- CreateEnum
CREATE TYPE "track_side" AS ENUM ('a', 'b');

-- CreateEnum
CREATE TYPE "musical_key" AS ENUM ('C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'D#', 'D#m', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'G#', 'G#m', 'A', 'Am', 'A#', 'A#m', 'B', 'Bm');

-- AlterTable
-- The USING casts rely on existing "side"/"musical_key" text values already
-- matching the enum labels above (e.g. 'a', 'C#') — true for all rows seeded
-- so far. If a differently-cased or unrecognized value exists in production
-- data, this cast will fail and the row must be fixed manually first.
ALTER TABLE "tracks"
  ALTER COLUMN "side" TYPE "track_side" USING ("side"::"track_side"),
  ALTER COLUMN "musical_key" TYPE "musical_key" USING ("musical_key"::"musical_key");

-- CreateIndex
CREATE INDEX "tracks_lead_member_id_idx" ON "tracks"("lead_member_id");

-- CreateIndex
CREATE INDEX "tracks_band_id_idx" ON "tracks"("band_id");

-- CreateIndex
CREATE INDEX "band_members_band_id_idx" ON "band_members"("band_id");
