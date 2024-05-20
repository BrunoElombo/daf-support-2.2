/*
  Warnings:

  - You are about to alter the column `power` on the `function` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `function` MODIFY `power` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `role` MODIFY `power` INTEGER NOT NULL DEFAULT 0;
