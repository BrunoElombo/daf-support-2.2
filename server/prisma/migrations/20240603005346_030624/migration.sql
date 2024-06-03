-- AlterTable
ALTER TABLE `bankaccount` ADD COLUMN `id_employee` VARCHAR(191) NULL,
    ADD COLUMN `id_entity` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_id_employee_fkey` FOREIGN KEY (`id_employee`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
