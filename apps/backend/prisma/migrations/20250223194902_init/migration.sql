-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "quiz";

-- CreateEnum
CREATE TYPE "quiz"."quiz_type" AS ENUM ('ga', 'agt', 'cbrn', 'radio');

-- CreateEnum
CREATE TYPE "inventory"."funk_item_event_type" AS ENUM ('borrowed', 'returned');

-- CreateTable
CREATE TABLE "quiz"."questions" (
    "id" SERIAL NOT NULL,
    "type" "quiz"."quiz_type" NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz"."question_answers" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz"."question_stats" (
    "id" SERIAL NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "question_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."users" (
    "id" UUID NOT NULL,
    "kindeId" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "picture" VARCHAR(1000),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."organisations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "inviteCode" VARCHAR(50) NOT NULL,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."organisation_members" (
    "organisationId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "organisation_members_pkey" PRIMARY KEY ("organisationId","userId")
);

-- CreateTable
CREATE TABLE "inventory"."funk_items" (
    "id" UUID NOT NULL,
    "deviceId" VARCHAR(100) NOT NULL,
    "organisationId" UUID NOT NULL,

    CONSTRAINT "funk_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_events" (
    "id" UUID NOT NULL,
    "type" "inventory"."funk_item_event_type" NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "funkItemId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "funk_item_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_event_bulks" (
    "id" UUID NOT NULL,
    "eventType" "inventory"."funk_item_event_type" NOT NULL,
    "batteryCount" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "organisationId" UUID NOT NULL,

    CONSTRAINT "funk_item_event_bulks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_event_bulk_events" (
    "bulkId" UUID NOT NULL,
    "eventId" UUID NOT NULL,

    CONSTRAINT "funk_item_event_bulk_events_pkey" PRIMARY KEY ("bulkId","eventId")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_items" (
    "id" UUID NOT NULL,
    "einheit" VARCHAR(100) NOT NULL,
    "ebene" INTEGER NOT NULL,
    "art" VARCHAR(100),
    "menge" DOUBLE PRECISION,
    "mengeIst" DOUBLE PRECISION,
    "verfuegbar" DOUBLE PRECISION,
    "ausstattung" VARCHAR(255) NOT NULL,
    "hersteller" VARCHAR(100),
    "typ" VARCHAR(100),
    "inventarNummer" VARCHAR(50),
    "sachNummer" VARCHAR(50),
    "gerateNummer" VARCHAR(50),
    "status" VARCHAR(50),
    "organisationId" UUID NOT NULL,
    "customDataId" UUID,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_item_custom_data" (
    "id" UUID NOT NULL,
    "lastScanned" TIMESTAMP(6),
    "note" VARCHAR(1000),

    CONSTRAINT "inventory_item_custom_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questions_type_number_key" ON "quiz"."questions"("type", "number");

-- CreateIndex
CREATE UNIQUE INDEX "users_kindeId_key" ON "inventory"."users"("kindeId");

-- CreateIndex
CREATE UNIQUE INDEX "organisations_inviteCode_key" ON "inventory"."organisations"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "funk_items_deviceId_organisationId_key" ON "inventory"."funk_items"("deviceId", "organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_customDataId_key" ON "inventory"."inventory_items"("customDataId");

-- AddForeignKey
ALTER TABLE "quiz"."question_answers" ADD CONSTRAINT "question_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz"."question_stats" ADD CONSTRAINT "question_stats_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."organisation_members" ADD CONSTRAINT "organisation_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."organisation_members" ADD CONSTRAINT "organisation_members_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_items" ADD CONSTRAINT "funk_items_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_events" ADD CONSTRAINT "funk_item_events_funkItemId_fkey" FOREIGN KEY ("funkItemId") REFERENCES "inventory"."funk_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_events" ADD CONSTRAINT "funk_item_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulks" ADD CONSTRAINT "funk_item_event_bulks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulks" ADD CONSTRAINT "funk_item_event_bulks_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulk_events" ADD CONSTRAINT "funk_item_event_bulk_events_bulkId_fkey" FOREIGN KEY ("bulkId") REFERENCES "inventory"."funk_item_event_bulks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulk_events" ADD CONSTRAINT "funk_item_event_bulk_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "inventory"."funk_item_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventory_items" ADD CONSTRAINT "inventory_items_customDataId_fkey" FOREIGN KEY ("customDataId") REFERENCES "inventory"."inventory_item_custom_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventory_items" ADD CONSTRAINT "inventory_items_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
