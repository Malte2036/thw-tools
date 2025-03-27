-- CreateTable
CREATE TABLE "inventory"."vehicles" (
    "id" UUID NOT NULL,
    "licensePlate" VARCHAR(50) NOT NULL,
    "vehicleType" VARCHAR(50) NOT NULL,
    "radioCallName" VARCHAR(50) NOT NULL,
    "unit" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "organisationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."vehicle_rentals" (
    "id" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "purpose" VARCHAR(255) NOT NULL,
    "plannedStart" TIMESTAMP(6) NOT NULL,
    "plannedEnd" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vehicle_rentals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory"."vehicles" ADD CONSTRAINT "vehicles_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."vehicle_rentals" ADD CONSTRAINT "vehicle_rentals_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "inventory"."vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."vehicle_rentals" ADD CONSTRAINT "vehicle_rentals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
