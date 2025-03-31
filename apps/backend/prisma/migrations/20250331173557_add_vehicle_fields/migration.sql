-- AlterTable
ALTER TABLE "inventory"."vehicles" ADD COLUMN     "bodyManufacturer" VARCHAR(255),
ADD COLUMN     "bodyType" VARCHAR(255),
ADD COLUMN     "chassis" VARCHAR(255),
ADD COLUMN     "load" VARCHAR(255),
ADD COLUMN     "payload" VARCHAR(50),
ADD COLUMN     "seats" INTEGER,
ADD COLUMN     "specialFeatures" VARCHAR(1000),
ADD COLUMN     "totalWeight" VARCHAR(50),
ADD COLUMN     "yearBuilt" INTEGER,
ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
