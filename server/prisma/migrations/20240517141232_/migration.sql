-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_id_function_fkey`;

-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_id_role_fkey`;

-- AlterTable
ALTER TABLE `employee` MODIFY `id_function` VARCHAR(191) NULL,
    MODIFY `id_role` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_function_fkey` FOREIGN KEY (`id_function`) REFERENCES `Function`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_role_fkey` FOREIGN KEY (`id_role`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
