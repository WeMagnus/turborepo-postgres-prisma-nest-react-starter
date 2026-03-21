CREATE TYPE "note_type" AS ENUM ('danger', 'success', 'info', 'warning');

ALTER TABLE "notes"
ADD COLUMN "type" "note_type" NOT NULL DEFAULT 'info';
