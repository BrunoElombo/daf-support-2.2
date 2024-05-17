/*
  Warnings:

  - You are about to drop the column `chief_department` on the `department` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_chief_department_fkey`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `chief_department`,
    ADD COLUMN `id_user` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
