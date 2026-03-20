-- Rename existing mixed-case tables to snake_case names.
ALTER TABLE "User" RENAME TO "users";
ALTER TABLE "CounterState" RENAME TO "counter_states";

-- Rename columns to snake_case while preserving existing data.
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "counter_states" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "counter_states" RENAME COLUMN "updatedAt" TO "updated_at";

-- Keep constraint and index names aligned with the new table names.
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER TABLE "counter_states" RENAME CONSTRAINT "CounterState_pkey" TO "counter_states_pkey";
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
