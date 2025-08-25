-- CreateEnum
CREATE TYPE "inventory"."mission_status" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "inventory"."material_status" AS ENUM ('CHECKED_OUT', 'RETURNED', 'LOST', 'DEFECTIVE');

-- CreateTable
CREATE TABLE "inventory"."missions" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "description" VARCHAR(1000),
    "startDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(6),
    "status" "inventory"."mission_status" NOT NULL DEFAULT 'ACTIVE',
    "organisationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."mission_materials" (
    "id" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "inventoryItemId" UUID,
    "manualName" VARCHAR(255),
    "manualQuantity" DOUBLE PRECISION DEFAULT 1,
    "manualUnit" VARCHAR(50),
    "status" "inventory"."material_status" NOT NULL DEFAULT 'CHECKED_OUT',
    "checkedOutAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "mission_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory"."missions" ADD CONSTRAINT "missions_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."mission_materials" ADD CONSTRAINT "mission_materials_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "inventory"."missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."mission_materials" ADD CONSTRAINT "mission_materials_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory"."inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
