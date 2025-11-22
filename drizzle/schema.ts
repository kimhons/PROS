import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Professional information for lead capture
  organization: varchar("organization", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 200 }),
  credentials: varchar("credentials", { length: 200 }), // e.g., "ABR, DABR, MS"
  specialty: varchar("specialty", { length: 100 }), // e.g., "Medical Physics", "Radiation Therapy"
  yearsExperience: int("yearsExperience"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Job postings table for career opportunities
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(), // e.g., "Medical Physics", "Radiation Therapy"
  location: varchar("location", { length: 255 }).notNull(),
  employmentType: mysqlEnum("employmentType", ["full-time", "part-time", "contract", "locum-tenens"]).notNull(),
  clearanceRequired: mysqlEnum("clearanceRequired", ["none", "public-trust", "secret", "top-secret"]).default("none").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").notNull(),
  benefits: text("benefits"),
  salaryRange: varchar("salaryRange", { length: 100 }),
  isActive: int("isActive").default(1).notNull(), // 1 = active, 0 = inactive
  externalJobId: varchar("externalJobId", { length: 100 }), // For imported jobs from external sources
  postedDate: timestamp("postedDate").defaultNow().notNull(),
  closingDate: timestamp("closingDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Job applications submitted by candidates
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  resumeUrl: varchar("resumeUrl", { length: 500 }).notNull(), // S3 URL
  coverLetter: text("coverLetter"),
  yearsExperience: int("yearsExperience"),
  currentClearance: varchar("currentClearance", { length: 50 }),
  certifications: text("certifications"), // JSON array of certifications
  status: mysqlEnum("status", ["new", "reviewing", "interview", "offer", "rejected", "hired"]).default("new").notNull(),
  notes: text("notes"), // Admin notes
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Contact form submissions
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  organization: varchar("organization", { length: 255 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  inquiryType: mysqlEnum("inquiryType", ["staffing", "technology", "partnership", "general"]).default("general").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "resolved"]).default("new").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Newsletter issues published biweekly
 */
export const newsletterIssues = mysqlTable("newsletterIssues", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  issueNumber: int("issueNumber").notNull().unique(), // Sequential issue number
  publishDate: timestamp("publishDate").notNull(),
  description: text("description"), // Brief summary of the issue
  coverImageUrl: varchar("coverImageUrl", { length: 500 }),
  isPublished: int("isPublished").default(0).notNull(), // 1 = published, 0 = draft
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterIssue = typeof newsletterIssues.$inferSelect;
export type InsertNewsletterIssue = typeof newsletterIssues.$inferInsert;

/**
 * Individual articles within newsletter issues
 */
export const newsletterArticles = mysqlTable("newsletterArticles", {
  id: int("id").autoincrement().primaryKey(),
  issueId: int("issueId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["latest-news", "best-practices", "research", "clinical-recommendations", "technology", "case-studies", "industry-updates"]).notNull(),
  author: varchar("author", { length: 200 }),
  content: text("content").notNull(), // Markdown content
  excerpt: text("excerpt"), // Short summary for listings
  imageUrl: varchar("imageUrl", { length: 500 }),
  orderIndex: int("orderIndex").default(0).notNull(), // Display order within issue
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsletterArticle = typeof newsletterArticles.$inferSelect;
export type InsertNewsletterArticle = typeof newsletterArticles.$inferInsert;

/**
 * Newsletter subscribers
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  organization: varchar("organization", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 200 }),
  isActive: int("isActive").default(1).notNull(), // 1 = subscribed, 0 = unsubscribed
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Treatment protocols table for protocol library
 */
export const protocols = mysqlTable("protocols", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  diseasesite: varchar("diseasesite", { length: 100 }).notNull(), // e.g., "Prostate", "Breast", "Lung"
  stage: varchar("stage", { length: 100 }), // e.g., "Early Stage", "Locally Advanced", "Metastatic"
  modality: varchar("modality", { length: 100 }).notNull(), // e.g., "IMRT", "SBRT", "Proton", "3D-CRT"
  intent: mysqlEnum("intent", ["definitive", "adjuvant", "neoadjuvant", "palliative"]).notNull(),
  totalDose: varchar("totalDose", { length: 50 }).notNull(), // e.g., "78 Gy"
  fractions: int("fractions").notNull(),
  dosePerFraction: varchar("dosePerFraction", { length: 50 }).notNull(), // e.g., "2 Gy"
  targetVolume: text("targetVolume"), // Description of target volumes (GTV, CTV, PTV)
  oarConstraints: text("oarConstraints"), // Organ at risk dose constraints
  technique: text("technique"), // Treatment technique details
  clinicalNotes: text("clinicalNotes"), // Additional clinical context
  references: text("references"), // Citations (NCCN, ASTRO, trials)
  isActive: int("isActive").default(1).notNull(),
  createdBy: int("createdBy").notNull(), // User ID of creator
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Protocol = typeof protocols.$inferSelect;
export type InsertProtocol = typeof protocols.$inferInsert;

/**
 * User favorites for protocols
 */
export const protocolFavorites = mysqlTable("protocolFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  protocolId: int("protocolId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProtocolFavorite = typeof protocolFavorites.$inferSelect;
export type InsertProtocolFavorite = typeof protocolFavorites.$inferInsert;

/**
 * QA checklist templates table
 */
export const qaTemplates = mysqlTable("qaTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["machine-qa", "reference-dosimetry", "quality-management", "patient-specific-qa", "custom"]).notNull(),
  tgReport: varchar("tgReport", { length: 50 }), // e.g., "TG-142", "TG-51", "TG-100"
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly", "quarterly", "annual", "as-needed"]),
  equipmentType: varchar("equipmentType", { length: 100 }), // e.g., "Linear Accelerator", "CT Simulator", "Treatment Planning System"
  manufacturer: varchar("manufacturer", { length: 100 }), // e.g., "Varian", "Elekta", "Accuray"
  description: text("description"),
  checklistItems: text("checklistItems").notNull(), // JSON array of checklist items
  tolerances: text("tolerances"), // JSON object of tolerance specifications
  references: text("references"), // Citations to TG reports, guidelines
  isActive: int("isActive").default(1).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QATemplate = typeof qaTemplates.$inferSelect;
export type InsertQATemplate = typeof qaTemplates.$inferInsert;

/**
 * User-generated QA checklists (instances of templates)
 */
export const qaChecklists = mysqlTable("qaChecklists", {
  id: int("id").autoincrement().primaryKey(),
  templateId: int("templateId"), // null if custom checklist
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  equipmentId: varchar("equipmentId", { length: 100 }), // e.g., "Linac 1", "TrueBeam STx"
  performedDate: timestamp("performedDate"),
  performedBy: varchar("performedBy", { length: 255 }),
  reviewedBy: varchar("reviewedBy", { length: 255 }),
  checklistData: text("checklistData").notNull(), // JSON of completed checklist with results
  notes: text("notes"),
  status: mysqlEnum("status", ["draft", "completed", "reviewed", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QAChecklist = typeof qaChecklists.$inferSelect;
export type InsertQAChecklist = typeof qaChecklists.$inferInsert;

/**
 * Blog posts for technical articles and thought leadership
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(), // Markdown content
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Staffing Solutions", "Quality Assurance", "Technology"
  tags: text("tags"), // Comma-separated tags for filtering
  authorId: int("authorId").notNull(),
  authorName: varchar("authorName", { length: 200 }).notNull(),
  authorCredentials: varchar("authorCredentials", { length: 200 }), // e.g., "PhD, DABR"
  featuredImage: varchar("featuredImage", { length: 500 }),
  readTime: int("readTime").notNull(), // Estimated reading time in minutes
  viewCount: int("viewCount").default(0).notNull(),
  isPublished: int("isPublished").default(1).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
