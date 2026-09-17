-- AlterTable
ALTER TABLE `letters` ADD COLUMN `signerName` VARCHAR(191) NULL,
    ADD COLUMN `signerRole` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `template_versions` ADD COLUMN `signerName` VARCHAR(191) NULL,
    ADD COLUMN `signerRole` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `templates` ADD COLUMN `signerName` VARCHAR(191) NULL,
    ADD COLUMN `signerRole` VARCHAR(191) NULL;
