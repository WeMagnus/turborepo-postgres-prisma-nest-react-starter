-- Convert users.id from text/cuid to UUID while preserving rows.
ALTER TABLE "users" ADD COLUMN "id_v2" UUID;
UPDATE "users" SET "id_v2" = gen_random_uuid() WHERE "id_v2" IS NULL;
ALTER TABLE "users" ALTER COLUMN "id_v2" SET NOT NULL;
ALTER TABLE "users" DROP CONSTRAINT "users_pkey";
ALTER TABLE "users" DROP COLUMN "id";
ALTER TABLE "users" RENAME COLUMN "id_v2" TO "id";
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- Keep the global counter singleton semantics via a separate unique key field.
ALTER TABLE "counter_states" ADD COLUMN "key" TEXT;
UPDATE "counter_states" SET "key" = "id" WHERE "key" IS NULL;
ALTER TABLE "counter_states" ALTER COLUMN "key" SET NOT NULL;

-- Convert counter_states.id from the old string key to a UUID primary key.
ALTER TABLE "counter_states" ADD COLUMN "id_v2" UUID;
UPDATE "counter_states" SET "id_v2" = gen_random_uuid() WHERE "id_v2" IS NULL;
ALTER TABLE "counter_states" ALTER COLUMN "id_v2" SET NOT NULL;
ALTER TABLE "counter_states" DROP CONSTRAINT "counter_states_pkey";
ALTER TABLE "counter_states" DROP COLUMN "id";
ALTER TABLE "counter_states" RENAME COLUMN "id_v2" TO "id";
ALTER TABLE "counter_states" ADD CONSTRAINT "counter_states_pkey" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "counter_states_key_key" ON "counter_states"("key");
