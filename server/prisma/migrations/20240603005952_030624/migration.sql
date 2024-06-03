-- AlterTable
ALTER TABLE `bankaccount` ADD COLUMN `id_external_entity` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `BankAccount` ADD CONSTRAINT `BankAccount_id_external_entity_fkey` FOREIGN KEY (`id_external_entity`) REFERENCES `ExternalEntity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
