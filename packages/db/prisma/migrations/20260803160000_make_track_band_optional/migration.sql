-- AlterTable: make band_id nullable on tracks (solo tracks have no band)
ALTER TABLE "tracks" ALTER COLUMN "band_id" DROP NOT NULL;
