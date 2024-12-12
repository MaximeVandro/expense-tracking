/*
  Warnings:

  - Added the required column `couleur` to the `TransactionCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransactionCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "couleur" TEXT NOT NULL
);
INSERT INTO "new_TransactionCategory" ("id", "name", "type") SELECT "id", "name", "type" FROM "TransactionCategory";
DROP TABLE "TransactionCategory";
ALTER TABLE "new_TransactionCategory" RENAME TO "TransactionCategory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
