/*
  Warnings:

  - You are about to drop the `_banktoemployee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_banktoentity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_banktoexternalentity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_banktoemployee` DROP FOREIGN KEY `_BankToEmployee_A_fkey`;

-- DropForeignKey
ALTER TABLE `_banktoemployee` DROP FOREIGN KEY `_BankToEmployee_B_fkey`;

-- DropForeignKey
ALTER TABLE `_banktoentity` DROP FOREIGN KEY `_BankToEntity_A_fkey`;

-- DropForeignKey
ALTER TABLE `_banktoentity` DROP FOREIGN KEY `_BankToEntity_B_fkey`;

-- DropForeignKey
ALTER TABLE `_banktoexternalentity` DROP FOREIGN KEY `_BankToExternalEntity_A_fkey`;

-- DropForeignKey
ALTER TABLE `_banktoexternalentity` DROP FOREIGN KEY `_BankToExternalEntity_B_fkey`;

-- DropTable
DROP TABLE `_banktoemployee`;

-- DropTable
DROP TABLE `_banktoentity`;

-- DropTable
DROP TABLE `_banktoexternalentity`;

-- CreateTable
CREATE TABLE `EntityBank` (
    `id` VARCHAR(191) NOT NULL,
    `id_entity` VARCHAR(191) NOT NULL,
    `id_bank` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExternalEntityBank` (
    `id` VARCHAR(191) NOT NULL,
    `id_external_entity` VARCHAR(191) NOT NULL,
    `id_bank` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeBank` (
    `id` VARCHAR(191) NOT NULL,
    `id_employee` VARCHAR(191) NOT NULL,
    `id_bank` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EntityBank` ADD CONSTRAINT `EntityBank_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityBank` ADD CONSTRAINT `EntityBank_id_bank_fkey` FOREIGN KEY (`id_bank`) REFERENCES `Bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExternalEntityBank` ADD CONSTRAINT `ExternalEntityBank_id_external_entity_fkey` FOREIGN KEY (`id_external_entity`) REFERENCES `ExternalEntity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExternalEntityBank` ADD CONSTRAINT `ExternalEntityBank_id_bank_fkey` FOREIGN KEY (`id_bank`) REFERENCES `Bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeBank` ADD CONSTRAINT `EmployeeBank_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeBank` ADD CONSTRAINT `EmployeeBank_id_bank_fkey` FOREIGN KEY (`id_bank`) REFERENCES `Bank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
