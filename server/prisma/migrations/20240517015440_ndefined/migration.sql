/*
  Warnings:

  - You are about to drop the column `id_employee` on the `role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_id_employee_fkey`;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `id_employee`;

-- CreateTable
CREATE TABLE `EmployeeRole` (
    `id` VARCHAR(191) NOT NULL,
    `id_role` VARCHAR(191) NOT NULL,
    `id_employee` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeeRole` ADD CONSTRAINT `EmployeeRole_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeRole` ADD CONSTRAINT `EmployeeRole_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
