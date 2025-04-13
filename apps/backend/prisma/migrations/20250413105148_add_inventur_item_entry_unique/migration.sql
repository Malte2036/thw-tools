/*
  Warnings:

  - A unique constraint covering the columns `[inventurSessionId,inventarItemId]` on the table `inventur_item_entries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventur_item_entries_inventurSessionId_inventarItemId_key" ON "inventory"."inventur_item_entries"("inventurSessionId", "inventarItemId");
