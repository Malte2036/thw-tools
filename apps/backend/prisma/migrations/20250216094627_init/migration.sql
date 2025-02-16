-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "inventory";

-- CreateEnum
CREATE TYPE "public"."quiz_type" AS ENUM ('ga', 'agt', 'cbrn', 'radio');

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" SERIAL NOT NULL,
    "type" "public"."quiz_type" NOT NULL,
    "number" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_answers" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "question_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_stats" (
    "id" SERIAL NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "question_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."users" (
    "id" UUID NOT NULL,
    "kindeId" VARCHAR NOT NULL,
    "email" VARCHAR,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "picture" VARCHAR,

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."organisations" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "inviteCode" VARCHAR NOT NULL,

    CONSTRAINT "PK_7bf54cba378d5b2f1d4c10ef4df" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."organisation_members" (
    "organisationId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "PK_31c59fd239370273eaebae47286" PRIMARY KEY ("organisationId","userId")
);

-- CreateTable
CREATE TABLE "inventory"."funk_items" (
    "id" UUID NOT NULL,
    "deviceId" VARCHAR NOT NULL,
    "organisationId" UUID NOT NULL,

    CONSTRAINT "PK_4018f31dcfa717cce5e1c63c95e" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_events" (
    "id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "funkItemId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "PK_fb2bee4ee4c31d14b2c904abf99" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_event_bulks" (
    "id" UUID NOT NULL,
    "eventType" VARCHAR NOT NULL,
    "batteryCount" INTEGER NOT NULL DEFAULT 0,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "organisationId" UUID NOT NULL,

    CONSTRAINT "PK_4b609ea84dc00cc7b09094f1f47" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."funk_item_event_bulk_events" (
    "bulkId" UUID NOT NULL,
    "eventId" UUID NOT NULL,

    CONSTRAINT "PK_f72bada2a3ce312defcf9f9bcec" PRIMARY KEY ("bulkId","eventId")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_items" (
    "id" UUID NOT NULL,
    "einheit" VARCHAR NOT NULL,
    "ebene" INTEGER NOT NULL,
    "art" VARCHAR,
    "menge" DOUBLE PRECISION,
    "mengeIst" DOUBLE PRECISION,
    "verfuegbar" DOUBLE PRECISION,
    "ausstattung" VARCHAR NOT NULL,
    "hersteller" VARCHAR,
    "typ" VARCHAR,
    "inventarNummer" VARCHAR,
    "sachNummer" VARCHAR,
    "gerateNummer" VARCHAR,
    "status" VARCHAR,
    "organisationId" UUID NOT NULL,
    "customDataId" UUID,

    CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory"."inventory_item_custom_data" (
    "id" UUID NOT NULL,
    "lastScanned" TIMESTAMP(6),
    "note" VARCHAR(1000),

    CONSTRAINT "PK_76e2636d847c4125f6eec1af659" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IDX_question_type_number" ON "public"."questions"("type", "number");

-- CreateIndex
CREATE INDEX "question_stats_questionId_idx" ON "public"."question_stats"("questionId");

-- CreateIndex
CREATE INDEX "question_stats_correct_idx" ON "public"."question_stats"("correct");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_4de10777c43acf165e02782b618" ON "inventory"."users"("kindeId");

-- CreateIndex
CREATE INDEX "IDX_4de10777c43acf165e02782b61" ON "inventory"."users"("kindeId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_f7c29efe391219ff62cd0390623" ON "inventory"."organisations"("inviteCode");

-- CreateIndex
CREATE INDEX "IDX_4441d3205f3198802398a15e56" ON "inventory"."organisation_members"("userId");

-- CreateIndex
CREATE INDEX "IDX_5abe5b0a1d4f49c3935be31589" ON "inventory"."organisation_members"("organisationId");

-- CreateIndex
CREATE UNIQUE INDEX "IDX_2b2b93c6e6d4ce9336d9dfd45a" ON "inventory"."funk_items"("deviceId", "organisationId");

-- CreateIndex
CREATE INDEX "IDX_a03810bb1dbfb743062c5252c3" ON "inventory"."funk_item_events"("funkItemId", "date");

-- CreateIndex
CREATE INDEX "IDX_f39cc7f4cd7e50e0ef8b88951c" ON "inventory"."funk_item_event_bulks"("organisationId", "date");

-- CreateIndex
CREATE INDEX "IDX_4ff567fb9c4a09fae13bcbc7dd" ON "inventory"."funk_item_event_bulk_events"("bulkId");

-- CreateIndex
CREATE INDEX "IDX_9af286bc003b40828e1ae893ca" ON "inventory"."funk_item_event_bulk_events"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "REL_430e647b0479b7dd3030d29d2d" ON "inventory"."inventory_items"("customDataId");

-- AddForeignKey
ALTER TABLE "public"."question_answers" ADD CONSTRAINT "question_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_stats" ADD CONSTRAINT "question_stats_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."organisation_members" ADD CONSTRAINT "FK_4441d3205f3198802398a15e567" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."organisation_members" ADD CONSTRAINT "FK_5abe5b0a1d4f49c3935be315896" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_items" ADD CONSTRAINT "FK_a171aa88c450ece840e031d055e" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_events" ADD CONSTRAINT "FK_ba49abe2ebe730facad537e18ec" FOREIGN KEY ("funkItemId") REFERENCES "inventory"."funk_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_events" ADD CONSTRAINT "FK_cc83c2dc763d279bf242f7fddb6" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulks" ADD CONSTRAINT "FK_6eab85aafc800335fbb7cd820f6" FOREIGN KEY ("userId") REFERENCES "inventory"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulks" ADD CONSTRAINT "FK_efc4f393db82fef35416923830c" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulk_events" ADD CONSTRAINT "FK_4ff567fb9c4a09fae13bcbc7dd3" FOREIGN KEY ("bulkId") REFERENCES "inventory"."funk_item_event_bulks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."funk_item_event_bulk_events" ADD CONSTRAINT "FK_9af286bc003b40828e1ae893cab" FOREIGN KEY ("eventId") REFERENCES "inventory"."funk_item_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"."inventory_items" ADD CONSTRAINT "FK_430e647b0479b7dd3030d29d2d8" FOREIGN KEY ("customDataId") REFERENCES "inventory"."inventory_item_custom_data"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory"."inventory_items" ADD CONSTRAINT "FK_4ae968223e9cbad14d439d71b45" FOREIGN KEY ("organisationId") REFERENCES "inventory"."organisations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
