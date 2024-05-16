-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entity` (
    `uuid` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `Sigle` VARCHAR(191) NULL,
    `raison_social` VARCHAR(191) NULL,
    `niu` VARCHAR(191) NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `uuid` VARCHAR(191) NOT NULL,
    `id_entity` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `budget` DOUBLE NULL,

    UNIQUE INDEX `Department_id_user_key`(`id_user`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Function` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `power` VARCHAR(191) NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EchelonCategory` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `uuid` VARCHAR(191) NOT NULL,
    `id_echelon` VARCHAR(191) NOT NULL,
    `id_grade` VARCHAR(191) NOT NULL,
    `id_fonction` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employee_id_echelon_key`(`id_echelon`),
    UNIQUE INDEX `Employee_id_grade_key`(`id_grade`),
    UNIQUE INDEX `Employee_id_user_key`(`id_user`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_id_entity_fkey` FOREIGN KEY (`id_entity`) REFERENCES `Entity`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_fonction_fkey` FOREIGN KEY (`id_fonction`) REFERENCES `Function`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_echelon_fkey` FOREIGN KEY (`id_echelon`) REFERENCES `EchelonCategory`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_grade_fkey` FOREIGN KEY (`id_grade`) REFERENCES `Grade`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
