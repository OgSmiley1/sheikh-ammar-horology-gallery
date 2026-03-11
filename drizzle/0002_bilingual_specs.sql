-- Add Arabic variants for watch specification fields
-- Safe to run multiple times (uses IF NOT EXISTS logic via server migration)
ALTER TABLE `watches`
  ADD COLUMN IF NOT EXISTS `materialAr` varchar(255),
  ADD COLUMN IF NOT EXISTS `dialColorAr` varchar(100),
  ADD COLUMN IF NOT EXISTS `caseSizeAr` varchar(50),
  ADD COLUMN IF NOT EXISTS `movementAr` varchar(255),
  ADD COLUMN IF NOT EXISTS `complicationsAr` text,
  ADD COLUMN IF NOT EXISTS `waterResistanceAr` varchar(50),
  ADD COLUMN IF NOT EXISTS `rarityAr` varchar(100);
