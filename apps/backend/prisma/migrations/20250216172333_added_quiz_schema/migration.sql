-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "quiz";

-- CreateEnum
CREATE TYPE "quiz"."quiz_type" AS ENUM ('ga', 'agt', 'cbrn', 'radio');

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

-- CreateIndex
CREATE UNIQUE INDEX "questions_type_number_key" ON "quiz"."questions"("type", "number");

-- CreateIndex
CREATE INDEX "question_answers_questionId_idx" ON "quiz"."question_answers"("questionId");

-- CreateIndex
CREATE INDEX "question_stats_questionId_idx" ON "quiz"."question_stats"("questionId");

-- CreateIndex
CREATE INDEX "question_stats_correct_idx" ON "quiz"."question_stats"("correct");

-- AddForeignKey
ALTER TABLE "quiz"."question_answers" ADD CONSTRAINT "question_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz"."question_stats" ADD CONSTRAINT "question_stats_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz"."questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
