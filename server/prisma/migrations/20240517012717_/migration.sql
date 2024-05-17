/*
  Warnings:

  - You are about to drop the column `niu` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `niu`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `niu` VARCHAR(191) NULL;
