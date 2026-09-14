-- CreateTable: many-to-many for track performers
CREATE TABLE "track_performers" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_performers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "track_performers_user_id_idx" ON "track_performers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "track_performers_track_id_user_id_key" ON "track_performers"("track_id", "user_id");

-- AddForeignKey
ALTER TABLE "track_performers" ADD CONSTRAINT "track_performers_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_performers" ADD CONSTRAINT "track_performers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
