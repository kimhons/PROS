CREATE TABLE `qaChecklists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`equipmentId` varchar(100),
	`performedDate` timestamp,
	`performedBy` varchar(255),
	`reviewedBy` varchar(255),
	`checklistData` text NOT NULL,
	`notes` text,
	`status` enum('draft','completed','reviewed','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `qaChecklists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qaTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('machine-qa','reference-dosimetry','quality-management','patient-specific-qa','custom') NOT NULL,
	`tgReport` varchar(50),
	`frequency` enum('daily','weekly','monthly','quarterly','annual','as-needed'),
	`equipmentType` varchar(100),
	`manufacturer` varchar(100),
	`description` text,
	`checklistItems` text NOT NULL,
	`tolerances` text,
	`references` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `qaTemplates_id` PRIMARY KEY(`id`)
);
