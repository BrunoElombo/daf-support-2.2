/*
  Warnings:

  - You are about to drop the column `id_user` on the `department` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_id_user_fkey`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `id_user`,
    ADD COLUMN `chief_department` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_chief_department_fkey` FOREIGN KEY (`chief_department`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
