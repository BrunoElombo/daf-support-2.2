/*
  Warnings:

  - You are about to drop the column `id_entity` on the `bankaccount` table. All the data in the column will be lost.
  - You are about to drop the column `id_external_entity` on the `bankaccount` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `bankaccount` DROP FOREIGN KEY `BankAccount_id_entity_fkey`;

-- DropForeignKey
ALTER TABLE `bankaccount` DROP FOREIGN KEY `BankAccount_id_external_entity_fkey`;

-- AlterTable
ALTER TABLE `bank` ADD COLUMN `id_employee` VARCHAR(191) NULL,
    ADD COLUMN `id_entity` VARCHAR(191) NULL,
    ADD COLUMN `id_external_entity` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `bankaccount` DROP COLUMN `id_entity`,
    DROP COLUMN `id_external_entity`;

-- AddForeignKey
ALTER TABLE `Bank` ADD CONSTRAINT `Bank_id_external_entity_fkey` FOREIGN KEY (`id_external_entity`) REFERENCES `ExternalEntity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bank` ADD CONSTRAINT `Bank_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bank` ADD CONSTRAINT `Bank_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
