-- AlterTable
ALTER TABLE "users" ALTER COLUMN "cep" SET DATA TYPE TEXT,
ALTER COLUMN "is_admin" SET DEFAULT false,
ALTER COLUMN "is_deleted" SET DEFAULT false,
ALTER COLUMN "is_confirmed" SET DEFAULT false;

-- CreateTable
CREATE TABLE "confirmation_codes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "confirmation_codes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "confirmation_codes" ADD CONSTRAINT "confirmation_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
