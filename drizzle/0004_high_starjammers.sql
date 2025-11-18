CREATE TABLE `protocolFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`protocolId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `protocolFavorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `protocols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`diseasesite` varchar(100) NOT NULL,
	`stage` varchar(100),
	`modality` varchar(100) NOT NULL,
	`intent` enum('definitive','adjuvant','neoadjuvant','palliative') NOT NULL,
	`totalDose` varchar(50) NOT NULL,
	`fractions` int NOT NULL,
	`dosePerFraction` varchar(50) NOT NULL,
	`targetVolume` text,
	`oarConstraints` text,
	`technique` text,
	`clinicalNotes` text,
	`references` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `protocols_id` PRIMARY KEY(`id`)
);
