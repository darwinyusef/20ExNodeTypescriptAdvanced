-- CreateTable
CREATE TABLE "Useras" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Useras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Useras_email_key" ON "Useras"("email");

-- CreateIndex
CREATE INDEX "Useras_tenantId_idx" ON "Useras"("tenantId");
