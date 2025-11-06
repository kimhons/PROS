CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`resumeUrl` varchar(500) NOT NULL,
	`coverLetter` text,
	`yearsExperience` int,
	`currentClearance` varchar(50),
	`certifications` text,
	`status` enum('new','reviewing','interview','offer','rejected','hired') NOT NULL DEFAULT 'new',
	`notes` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`organization` varchar(255),
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`inquiryType` enum('staffing','technology','partnership','general') NOT NULL DEFAULT 'general',
	`status` enum('new','contacted','resolved') NOT NULL DEFAULT 'new',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`department` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`employmentType` enum('full-time','part-time','contract','locum-tenens') NOT NULL,
	`clearanceRequired` enum('none','public-trust','secret','top-secret') NOT NULL DEFAULT 'none',
	`description` text NOT NULL,
	`requirements` text NOT NULL,
	`benefits` text,
	`salaryRange` varchar(100),
	`isActive` int NOT NULL DEFAULT 1,
	`externalJobId` varchar(100),
	`postedDate` timestamp NOT NULL DEFAULT (now()),
	`closingDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
