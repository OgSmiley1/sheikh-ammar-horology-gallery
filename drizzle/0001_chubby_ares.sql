CREATE TABLE `adminActivityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminUserId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int,
	`details` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminActivityLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `adminUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`fullName` varchar(255),
	`email` varchar(320),
	`role` varchar(50) NOT NULL DEFAULT 'admin',
	`isActive` boolean NOT NULL DEFAULT true,
	`lastLoginAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminUsers_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`logoUrl` varchar(500),
	`foundedYear` int,
	`country` varchar(100),
	`websiteUrl` varchar(500),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pageViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int,
	`brandId` int,
	`pagePath` varchar(500) NOT NULL,
	`pageTitle` varchar(255),
	`language` varchar(5),
	`visitorIp` varchar(45),
	`userAgent` text,
	`referrer` varchar(500),
	`country` varchar(100),
	`city` varchar(100),
	`deviceType` varchar(50),
	`sessionId` varchar(255),
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pageViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sheikhPhotos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int,
	`imageUrl` varchar(500) NOT NULL,
	`imageKey` varchar(500) NOT NULL,
	`captionEn` varchar(255),
	`captionAr` varchar(255),
	`eventName` varchar(255),
	`photoDate` date,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sheikhPhotos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoBackgrounds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`videoUrl` varchar(500) NOT NULL,
	`videoKey` varchar(500) NOT NULL,
	`thumbnailUrl` varchar(500),
	`duration` int,
	`resolution` varchar(20),
	`fileSize` int,
	`usageLocation` varchar(50) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoBackgrounds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`imageKey` varchar(500) NOT NULL,
	`imageType` varchar(50) NOT NULL,
	`captionEn` varchar(255),
	`captionAr` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`width` int,
	`height` int,
	`fileSize` int,
	`mimeType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandId` int NOT NULL,
	`referenceNumber` varchar(100) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`descriptionEn` text,
	`descriptionAr` text,
	`storyEn` text,
	`storyAr` text,
	`material` varchar(255),
	`dialColor` varchar(100),
	`caseSize` varchar(50),
	`movement` varchar(255),
	`complications` text,
	`waterResistance` varchar(50),
	`powerReserve` varchar(50),
	`limitedEdition` boolean NOT NULL DEFAULT false,
	`productionQuantity` int,
	`yearReleased` int,
	`retailPrice` int,
	`marketValue` int,
	`rarity` varchar(50),
	`mainImageUrl` varchar(500),
	`viewCount` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `watches_id` PRIMARY KEY(`id`),
	CONSTRAINT `watches_slug_unique` UNIQUE(`slug`)
);
