import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import * as ai from "./_core/ai";
import { notifyNewApplication, notifyNewContact } from "./notificationService";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  jobs: router({
    // Public: Get all active jobs
    list: publicProcedure.query(async () => {
      return await db.getAllActiveJobs();
    }),

    // Public: Get single job by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await db.getJobById(input.id);
        if (!job) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Job not found' });
        }
        return job;
      }),

    // Admin: Create new job
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        department: z.string().min(1),
        location: z.string().min(1),
        employmentType: z.enum(["full-time", "part-time", "contract", "locum-tenens"]),
        clearanceRequired: z.enum(["none", "public-trust", "secret", "top-secret"]),
        description: z.string().min(1),
        requirements: z.string().min(1),
        benefits: z.string().optional(),
        salaryRange: z.string().optional(),
        closingDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createJob(input);
        return { success: true };
      }),

    // Admin: Update job
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        department: z.string().min(1).optional(),
        location: z.string().min(1).optional(),
        employmentType: z.enum(["full-time", "part-time", "contract", "locum-tenens"]).optional(),
        clearanceRequired: z.enum(["none", "public-trust", "secret", "top-secret"]).optional(),
        description: z.string().min(1).optional(),
        requirements: z.string().min(1).optional(),
        benefits: z.string().optional(),
        salaryRange: z.string().optional(),
        isActive: z.number().optional(),
        closingDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateJob(id, updates);
        return { success: true };
      }),

    // Admin: Delete job (soft delete)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteJob(input.id);
        return { success: true };
      }),
  }),

  applications: router({
    // Public: Submit application
    submit: publicProcedure
      .input(z.object({
        jobId: z.number(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        resumeFile: z.object({
          name: z.string(),
          data: z.string(), // base64 encoded
          type: z.string(),
        }),
        coverLetter: z.string().optional(),
        yearsExperience: z.number().optional(),
        currentClearance: z.string().optional(),
        certifications: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Upload resume to S3
        const resumeBuffer = Buffer.from(input.resumeFile.data, 'base64');
        const timestamp = Date.now();
        const sanitizedName = input.resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileKey = `resumes/${input.jobId}/${timestamp}-${sanitizedName}`;
        
        const { url: resumeUrl } = await storagePut(
          fileKey,
          resumeBuffer,
          input.resumeFile.type
        );

        // Create application record
        await db.createApplication({
          jobId: input.jobId,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          resumeUrl,
          coverLetter: input.coverLetter,
          yearsExperience: input.yearsExperience,
          currentClearance: input.currentClearance,
          certifications: input.certifications,
        });

        // Get job details for notification
        const job = await db.getJobById(input.jobId);
        
        // Get all admin users to notify
        const adminUsers = await db.getAdminUsers();
        
        // Send notification to all admins
        for (const admin of adminUsers) {
          await notifyNewApplication(
            admin.id,
            input.jobId, // Using jobId as relatedId since we don't have the application ID
            `${input.firstName} ${input.lastName}`,
            job?.title || 'Unknown Position'
          );
        }

        return { success: true };
      }),

    // Admin: Get all applications
    listAll: adminProcedure.query(async () => {
      return await db.getAllApplications();
    }),

    // Admin: Get applications for specific job
    listByJob: adminProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        return await db.getApplicationsByJobId(input.jobId);
      }),

    // Admin: Update application status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "reviewing", "interview", "offer", "rejected", "hired"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateApplicationStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
  }),

  contacts: router({
    // Public: Submit contact form
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        organization: z.string().optional(),
        subject: z.string().min(1),
        message: z.string().min(1),
        inquiryType: z.enum(["staffing", "technology", "partnership", "general"]),
      }))
      .mutation(async ({ input }) => {
        await db.createContact(input);
        
        // Get all admin users to notify
        const adminUsers = await db.getAdminUsers();
        
        // Send notification to all admins
        for (const admin of adminUsers) {
          await notifyNewContact(
            admin.id,
            0, // We don't have the contact ID, using 0 as placeholder
            input.name,
            input.inquiryType
          );
        }
        
        return { success: true };
      }),

    // Admin: Get all contacts
    listAll: adminProcedure.query(async () => {
      return await db.getAllContacts();
    }),

    // Admin: Update contact status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "resolved"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateContactStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  protocols: router({
    // Protected: Get all protocols
    list: protectedProcedure.query(async () => {
      return await db.getAllProtocols();
    }),

    // Protected: Get single protocol by ID
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const protocol = await db.getProtocolById(input.id);
        if (!protocol) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Protocol not found' });
        }
        return protocol;
      }),

    // Protected: Get user's favorite protocols
    getFavorites: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFavoriteProtocols(ctx.user.id);
    }),

    // Protected: Add protocol to favorites
    addFavorite: protectedProcedure
      .input(z.object({ protocolId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.addProtocolFavorite(ctx.user.id, input.protocolId);
        return { success: true };
      }),

    // Protected: Remove protocol from favorites
    removeFavorite: protectedProcedure
      .input(z.object({ protocolId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeProtocolFavorite(ctx.user.id, input.protocolId);
        return { success: true };
      }),

    // Protected: Check if protocol is favorited
    isFavorited: protectedProcedure
      .input(z.object({ protocolId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.isProtocolFavorited(ctx.user.id, input.protocolId);
      }),

    // Admin: Create new protocol
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        diseasesite: z.string(),
        stage: z.string().optional(),
        modality: z.string(),
        intent: z.enum(["definitive", "adjuvant", "neoadjuvant", "palliative"]),
        totalDose: z.string(),
        fractions: z.number(),
        dosePerFraction: z.string(),
        targetVolume: z.string().optional(),
        oarConstraints: z.string().optional(),
        technique: z.string().optional(),
        clinicalNotes: z.string().optional(),
        references: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createProtocol({ ...input, createdBy: ctx.user.id });
        return { success: true };
      }),

    // Admin: Update protocol
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        diseasesite: z.string().optional(),
        stage: z.string().optional(),
        modality: z.string().optional(),
        intent: z.enum(["definitive", "adjuvant", "neoadjuvant", "palliative"]).optional(),
        totalDose: z.string().optional(),
        fractions: z.number().optional(),
        dosePerFraction: z.string().optional(),
        targetVolume: z.string().optional(),
        oarConstraints: z.string().optional(),
        technique: z.string().optional(),
        clinicalNotes: z.string().optional(),
        references: z.string().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProtocol(id, updates);
        return { success: true };
      }),

    // Admin: Delete protocol (soft delete)
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProtocol(input.id);
        return { success: true };
      }),
  }),

  newsletter: router({
    // Public: Get all published newsletter issues
    listIssues: publicProcedure.query(async () => {
      return await db.getAllPublishedNewsletterIssues();
    }),

    // Public: Get single newsletter issue with articles
    getIssue: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const issue = await db.getNewsletterIssueById(input.id);
        if (!issue) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Newsletter issue not found' });
        }
        const articles = await db.getNewsletterArticlesByIssueId(input.id);
        return { issue, articles };
      }),

    // Public: Subscribe to newsletter
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        organization: z.string().optional(),
        jobTitle: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createNewsletterSubscriber(
          input.email,
          input.firstName,
          input.lastName,
          input.organization,
          input.jobTitle
        );
        return { success: true };
      }),
  }),

  admin: router({
    // Get dashboard statistics
    getStats: adminProcedure.query(async () => {
      const activeJobs = await db.countActiveJobs();
      const pendingApplications = await db.countPendingApplications();
      const unreadContacts = await db.countUnreadContacts();
      const newsletterSubscribers = await db.countNewsletterSubscribers();
      
      return {
        activeJobs,
        pendingApplications,
        unreadContacts,
        newsletterSubscribers,
        recentActivity: [],
      };
    }),

    // AI: Generate job description
    generateJobDescription: adminProcedure
      .input(z.object({
        title: z.string(),
        department: z.string(),
        location: z.string(),
        clearance: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await ai.generateJobDescription(input);
      }),

    // AI: Analyze resume
    analyzeResume: adminProcedure
      .input(z.object({
        resumeText: z.string(),
        jobDescription: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await ai.analyzeResume(input.resumeText, input.jobDescription);
      }),

    // AI: Generate contact response
    generateContactResponse: adminProcedure
      .input(z.object({
        type: z.string(),
        name: z.string(),
        organization: z.string().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await ai.generateContactResponse(input);
      }),
  }),

  // AI Chat Assistant (public)
  chat: router({
    send: publicProcedure
      .input(z.object({
        message: z.string(),
        history: z.array(z.object({
          role: z.enum(['system', 'user', 'assistant']),
          content: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        return await ai.chatAssistant(input.message, input.history);
      }),
  }),

  // Notifications
  notifications: router({
    // Get notifications for current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNotificationsForUser(ctx.user.id);
    }),

    // Get unread count
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotificationCount(ctx.user.id);
    }),

    // Mark notification as read
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),

    // Mark all as read
    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    // Delete notification
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNotification(input.id);
        return { success: true };
      }),
  }),

  // Blog
  blog: router({
    // Public: Get all published blog posts
    list: publicProcedure.query(async () => {
      return await db.getAllPublishedBlogPosts();
    }),

    // Public: Get blog post by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' });
        }
        // Increment view count
        await db.incrementBlogPostViews(input.slug);
        return post;
      }),

    // Public: Get blog posts by category
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getBlogPostsByCategory(input.category);
      }),

    // Public: Search blog posts
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await db.searchBlogPosts(input.query);
      }),

    // Public: Get related posts
    getRelated: publicProcedure
      .input(z.object({ slug: z.string(), category: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getRelatedBlogPosts(input.slug, input.category, input.limit);
      }),

    // Admin: Create blog post
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string(),
        content: z.string(),
        category: z.string(),
        tags: z.string().optional(),
        authorName: z.string(),
        authorCredentials: z.string().optional(),
        featuredImage: z.string().optional(),
        readTime: z.number(),
        isPublished: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createBlogPost({ ...input, authorId: ctx.user.id });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
