-- DropIndex
-- Superseded by the composite unique index below: (band_id, order) also
-- covers plain "filter by band_id" lookups via the leftmost-prefix rule.
DROP INDEX "tracks_band_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "tracks_band_id_order_key" ON "tracks"("band_id", "order");
