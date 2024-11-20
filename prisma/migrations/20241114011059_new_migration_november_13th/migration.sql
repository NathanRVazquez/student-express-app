-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_authId_key" ON "Users"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
