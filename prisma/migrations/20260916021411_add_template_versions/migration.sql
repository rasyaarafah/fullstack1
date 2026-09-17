/*
  Warnings:

  - Added the required column `updated_at` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `letters` ADD COLUMN `leftLogo` VARCHAR(191) NULL,
    ADD COLUMN `rightLogo` VARCHAR(191) NULL,
    ADD COLUMN `templateId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `templates` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `template_versions` (
    `id` VARCHAR(191) NOT NULL,
    `template_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `placeholders` TEXT NOT NULL,
    `bodyContent` TEXT NOT NULL,
    `saved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `letters` ADD CONSTRAINT `letters_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `template_versions` ADD CONSTRAINT `template_versions_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
