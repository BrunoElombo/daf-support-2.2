/*
  Warnings:

  - Added the required column `id_entity` to the `ExternalEntity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `externalentity` ADD COLUMN `id_entity` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ExternalEntity` ADD CONSTRAINT `ExternalEntity_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
