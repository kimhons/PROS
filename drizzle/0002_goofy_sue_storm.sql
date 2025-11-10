CREATE TABLE `newsletterArticles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` enum('latest-news','best-practices','research','clinical-recommendations','technology','case-studies','industry-updates') NOT NULL,
	`author` varchar(200),
	`content` text NOT NULL,
	`excerpt` text,
	`imageUrl` varchar(500),
	`orderIndex` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletterArticles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletterIssues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`issueNumber` int NOT NULL,
	`publishDate` timestamp NOT NULL,
	`description` text,
	`coverImageUrl` varchar(500),
	`isPublished` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletterIssues_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterIssues_issueNumber_unique` UNIQUE(`issueNumber`)
);
--> statement-breakpoint
CREATE TABLE `newsletterSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`organization` varchar(255),
	`jobTitle` varchar(200),
	`isActive` int NOT NULL DEFAULT 1,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	CONSTRAINT `newsletterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscribers_email_unique` UNIQUE(`email`)
);
