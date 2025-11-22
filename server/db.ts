import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobs, applications, contacts, InsertJob, InsertApplication, InsertContact, protocols, protocolFavorites, InsertProtocol, InsertProtocolFavorite, blogPosts, InsertBlogPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Job-related queries
export async function getAllActiveJobs() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(jobs).where(eq(jobs.isActive, 1)).orderBy(desc(jobs.postedDate));
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJob(job: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(jobs).values(job);
  return result;
}

export async function updateJob(id: number, updates: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(jobs).set(updates).where(eq(jobs.id, id));
}

export async function deleteJob(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Soft delete by setting isActive to 0
  await db.update(jobs).set({ isActive: 0 }).where(eq(jobs.id, id));
}

// Application-related queries
export async function createApplication(application: InsertApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(applications).values(application);
  return result;
}

export async function getApplicationsByJobId(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.submittedAt));
}

export async function getAllApplications() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(applications).orderBy(desc(applications.submittedAt));
}

export async function updateApplicationStatus(id: number, status: "new" | "reviewing" | "interview" | "offer" | "rejected" | "hired", notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: any = { status };
  if (notes !== undefined) {
    updates.notes = notes;
  }
  
  await db.update(applications).set(updates).where(eq(applications.id, id));
}

// Contact-related queries
export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contacts).values(contact);
  return result;
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contacts).orderBy(desc(contacts.submittedAt));
}

export async function updateContactStatus(id: number, status: "new" | "contacted" | "resolved") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contacts).set({ status }).where(eq(contacts.id, id));
}


// Newsletter-related queries
export async function getAllPublishedNewsletterIssues() {
  const db = await getDb();
  if (!db) return [];
  
  const { newsletterIssues } = await import("../drizzle/schema");
  return await db.select().from(newsletterIssues).where(eq(newsletterIssues.isPublished, 1)).orderBy(desc(newsletterIssues.publishDate));
}

export async function getNewsletterIssueById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { newsletterIssues } = await import("../drizzle/schema");
  const result = await db.select().from(newsletterIssues).where(eq(newsletterIssues.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getNewsletterArticlesByIssueId(issueId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { newsletterArticles } = await import("../drizzle/schema");
  const { asc } = await import("drizzle-orm");
  return await db.select().from(newsletterArticles).where(eq(newsletterArticles.issueId, issueId)).orderBy(asc(newsletterArticles.orderIndex));
}

export async function createNewsletterSubscriber(email: string, firstName?: string, lastName?: string, organization?: string, jobTitle?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { newsletterSubscribers } = await import("../drizzle/schema");
  
  const subscriber = {
    email,
    firstName,
    lastName,
    organization,
    jobTitle,
  };
  
  const result = await db.insert(newsletterSubscribers).values(subscriber).onDuplicateKeyUpdate({
    set: { isActive: 1, subscribedAt: new Date() },
  });
  
  return result;
}


// ============================================================================
// Protocol Library Functions
// ============================================================================

export async function getAllProtocols() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(protocols)
    .where(eq(protocols.isActive, 1))
    .orderBy(desc(protocols.createdAt));
  
  return result;
}

export async function getProtocolById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(protocols)
    .where(and(eq(protocols.id, id), eq(protocols.isActive, 1)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createProtocol(protocol: InsertProtocol) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(protocols).values(protocol);
}

export async function updateProtocol(id: number, updates: Partial<InsertProtocol>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(protocols)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(protocols.id, id));
}

export async function deleteProtocol(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Soft delete
  await db
    .update(protocols)
    .set({ isActive: 0 })
    .where(eq(protocols.id, id));
}

export async function getUserFavoriteProtocols(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      protocol: protocols,
      favoriteId: protocolFavorites.id,
    })
    .from(protocolFavorites)
    .innerJoin(protocols, eq(protocolFavorites.protocolId, protocols.id))
    .where(and(
      eq(protocolFavorites.userId, userId),
      eq(protocols.isActive, 1)
    ))
    .orderBy(desc(protocolFavorites.createdAt));
  
  return result.map(r => ({ ...r.protocol, favoriteId: r.favoriteId }));
}

export async function addProtocolFavorite(userId: number, protocolId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(protocolFavorites).values({ userId, protocolId });
}

export async function removeProtocolFavorite(userId: number, protocolId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(protocolFavorites)
    .where(and(
      eq(protocolFavorites.userId, userId),
      eq(protocolFavorites.protocolId, protocolId)
    ));
}

export async function isProtocolFavorited(userId: number, protocolId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(protocolFavorites)
    .where(and(
      eq(protocolFavorites.userId, userId),
      eq(protocolFavorites.protocolId, protocolId)
    ))
    .limit(1);
  
  return result.length > 0;
}

// ============================================================================
// Admin Statistics Functions
// ============================================================================

export async function countActiveJobs(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(jobs)
    .where(eq(jobs.isActive, 1));
  
  return result[0]?.count ?? 0;
}

export async function countPendingApplications(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(applications)
    .where(eq(applications.status, 'new'));
  
  return result[0]?.count ?? 0;
}

export async function countUnreadContacts(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(contacts)
    .where(eq(contacts.status, 'new'));
  
  return result[0]?.count ?? 0;
}

export async function countNewsletterSubscribers(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const { newsletterSubscribers } = await import("../drizzle/schema");
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, 1));
  
  return result[0]?.count ?? 0;
}

// ============================================================================
// Blog Functions
// ============================================================================

export async function getAllPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts)
    .where(eq(blogPosts.isPublished, 1))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, 1)))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts)
    .where(and(eq(blogPosts.category, category), eq(blogPosts.isPublished, 1)))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function searchBlogPosts(query: string) {
  const db = await getDb();
  if (!db) return [];
  
  const searchPattern = `%${query}%`;
  return await db.select().from(blogPosts)
    .where(and(
      eq(blogPosts.isPublished, 1),
      sql`(${blogPosts.title} LIKE ${searchPattern} OR ${blogPosts.excerpt} LIKE ${searchPattern} OR ${blogPosts.tags} LIKE ${searchPattern})`
    ))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(blogPosts).values(post);
}

export async function incrementBlogPostViews(slug: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.slug, slug));
}

export async function getRelatedBlogPosts(currentSlug: string, category: string, limit: number = 3) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts)
    .where(and(
      eq(blogPosts.category, category),
      eq(blogPosts.isPublished, 1),
      sql`${blogPosts.slug} != ${currentSlug}`
    ))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
}
