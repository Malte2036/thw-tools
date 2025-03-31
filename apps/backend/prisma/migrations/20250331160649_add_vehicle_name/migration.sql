/*
  Warnings:

  - Added the required column `name` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory"."vehicles" ADD COLUMN "name" VARCHAR(50);

-- Update existing records
UPDATE "inventory"."vehicles" SET "name" = "radioCallName";

-- Make column required
ALTER TABLE "inventory"."vehicles" ALTER COLUMN "name" SET NOT NULL;
