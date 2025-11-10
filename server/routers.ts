import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
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
});

export type AppRouter = typeof appRouter;
