/*
  Warnings:

  - You are about to drop the column `id_department` on the `function` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `function` DROP FOREIGN KEY `Function_id_department_fkey`;

-- AlterTable
ALTER TABLE `function` DROP COLUMN `id_department`;
