-- AlterTable
ALTER TABLE `department` ADD COLUMN `id_employee` VARCHAR(191) NULL,
    ADD COLUMN `id_user` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
