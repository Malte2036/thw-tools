/*
  Warnings:

  - Changed the type of `eventType` on the `funk_item_event_bulks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `funk_item_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "inventory"."funk_item_event_type" AS ENUM ('borrowed', 'returned');

-- AlterTable
ALTER TABLE "inventory"."funk_item_event_bulks" DROP COLUMN "eventType",
ADD COLUMN     "eventType" "inventory"."funk_item_event_type" NOT NULL;

-- AlterTable
ALTER TABLE "inventory"."funk_item_events" DROP COLUMN "type",
ADD COLUMN     "type" "inventory"."funk_item_event_type" NOT NULL;
