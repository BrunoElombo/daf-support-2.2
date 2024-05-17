-- DropForeignKey
ALTER TABLE `type_entity` DROP FOREIGN KEY `Type_Entity_id_entity_fkey`;

-- CreateTable
CREATE TABLE `ExternalEntity` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Type_Entity` ADD CONSTRAINT `Type_Entity_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `ExternalEntity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
