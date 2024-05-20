/*
  Warnings:

  - You are about to drop the column `id_employee` on the `bank` table. All the data in the column will be lost.
  - You are about to drop the column `id_entity` on the `bank` table. All the data in the column will be lost.
  - You are about to drop the column `id_external_entity` on the `bank` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `bank` DROP FOREIGN KEY `Bank_id_employee_fkey`;

-- DropForeignKey
ALTER TABLE `bank` DROP FOREIGN KEY `Bank_id_entity_fkey`;

-- DropForeignKey
ALTER TABLE `bank` DROP FOREIGN KEY `Bank_id_external_entity_fkey`;

-- AlterTable
ALTER TABLE `bank` DROP COLUMN `id_employee`,
    DROP COLUMN `id_entity`,
    DROP COLUMN `id_external_entity`;

-- CreateTable
CREATE TABLE `_BankToExternalEntity` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BankToExternalEntity_AB_unique`(`A`, `B`),
    INDEX `_BankToExternalEntity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BankToEntity` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BankToEntity_AB_unique`(`A`, `B`),
    INDEX `_BankToEntity_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BankToEmployee` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_BankToEmployee_AB_unique`(`A`, `B`),
    INDEX `_BankToEmployee_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_BankToExternalEntity` ADD CONSTRAINT `_BankToExternalEntity_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BankToExternalEntity` ADD CONSTRAINT `_BankToExternalEntity_B_fkey` FOREIGN KEY (`B`) REFERENCES `ExternalEntity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BankToEntity` ADD CONSTRAINT `_BankToEntity_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BankToEntity` ADD CONSTRAINT `_BankToEntity_B_fkey` FOREIGN KEY (`B`) REFERENCES `Entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BankToEmployee` ADD CONSTRAINT `_BankToEmployee_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bank`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BankToEmployee` ADD CONSTRAINT `_BankToEmployee_B_fkey` FOREIGN KEY (`B`) REFERENCES `Employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
