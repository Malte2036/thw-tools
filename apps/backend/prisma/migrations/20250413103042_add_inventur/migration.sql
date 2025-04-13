-- CreateEnum
CREATE TYPE "inventory"."inventur_session_status" AS ENUM ('running', 'completed', 'aborted');

-- CreateTable
CREATE TABLE "inventory"."inventur_sessions" (
    "id" UUID NOT NULL,
    "startTime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "organisationId" UUID NOT NULL,
    "einheit" VARCHAR(100) NOT NULL,
    "status" "inventory"."inventur_session_status" NOT NULL DEFAULT 'running',

    CONSTRAINT "inventur_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."inventur_session_participants" (
    "inventurSessionId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "inventur_session_participants_pkey" PRIMARY KEY ("inventurSessionId","userId")
);

-- CreateTable
CREATE TABLE "inventory"."inventur_item_entries" (
    "id" UUID NOT NULL,
    "inventurSessionId" UUID NOT NULL,
    "inventarItemId" UUID,
    "scannedCount" INTEGER,
    "note" TEXT,

    CONSTRAINT "inventur_item_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory"."inventur_sessions" ADD CONSTRAINT "inventur_sessions_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventur_session_participants" ADD CONSTRAINT "inventur_session_participants_inventurSessionId_fkey" FOREIGN KEY ("inventurSessionId") REFERENCES "inventory"."inventur_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventur_session_participants" ADD CONSTRAINT "inventur_session_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventur_item_entries" ADD CONSTRAINT "inventur_item_entries_inventurSessionId_fkey" FOREIGN KEY ("inventurSessionId") REFERENCES "inventory"."inventur_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventur_item_entries" ADD CONSTRAINT "inventur_item_entries_inventarItemId_fkey" FOREIGN KEY ("inventarItemId") REFERENCES "inventory"."inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
