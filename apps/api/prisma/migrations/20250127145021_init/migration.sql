-- CreateTable
CREATE TABLE "board" (
    "id" SERIAL NOT NULL,
    "matrix" JSONB NOT NULL,

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);
