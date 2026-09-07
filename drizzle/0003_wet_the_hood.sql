CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(255),
	`message` text NOT NULL,
	`language` varchar(5) NOT NULL,
	`status` enum('new','read','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`watchId` int NOT NULL,
	`userId` int NOT NULL,
	`body` text NOT NULL,
	`language` varchar(5) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchComments_id` PRIMARY KEY(`id`)
);
