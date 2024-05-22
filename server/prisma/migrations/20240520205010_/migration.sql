-- CreateTable
CREATE TABLE `Associer` (
    `id` VARCHAR(191) NOT NULL,
    `id_entity` VARCHAR(191) NOT NULL,
    `id_external_entity` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Associer` ADD CONSTRAINT `Associer_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Associer` ADD CONSTRAINT `Associer_id_external_entity_fkey` FOREIGN KEY (`id_external_entity`) REFERENCES `ExternalEntity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
