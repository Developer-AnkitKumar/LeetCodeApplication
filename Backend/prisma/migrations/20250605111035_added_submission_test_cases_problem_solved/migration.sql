-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "socurCode" JSONB NOT NULL,
    "language" TEXT NOT NULL,
    "stdin" TEXT,
    "stdout" TEXT,
    "stderr" TEXT,
    "compilerOutput" TEXT,
    "status" TEXT,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCasesResult" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "testCases" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "stdout" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "stderr" TEXT NOT NULL,
    "compilerOutput" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "memory" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCasesResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemSolved" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemSolved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TestCasesResult_submissionId_idx" ON "TestCasesResult"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemSolved_UserId_problemId_key" ON "ProblemSolved"("UserId", "problemId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCasesResult" ADD CONSTRAINT "TestCasesResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolved" ADD CONSTRAINT "ProblemSolved_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolved" ADD CONSTRAINT "ProblemSolved_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
