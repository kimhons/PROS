import { Resend } from "resend";
import { db } from "./db";
import { users, jobs, notificationLog } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

/**
 * Email Service for PROS Website
 * 
 * Handles sending weekly job match digest emails to candidates.
 * Uses Resend API for email delivery and logs all notifications to the database.
 */

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Calculate match score between a candidate profile and a job posting
 * Returns a score from 0-100 based on various matching criteria
 */
function calculateMatchScore(candidate: any, job: any): number {
  let score = 0;
  let totalWeight = 0;

  // Location match (weight: 30)
  if (candidate.desiredLocations) {
    try {
      const desiredLocations = JSON.parse(candidate.desiredLocations);
      if (Array.isArray(desiredLocations) && desiredLocations.length > 0) {
        totalWeight += 30;
        if (desiredLocations.some((loc: string) => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        )) {
          score += 30;
        }
      }
    } catch (e) {
      // Invalid JSON, skip location matching
    }
  }

  // Department match (weight: 30)
  if (candidate.desiredDepartments) {
    try {
      const desiredDepartments = JSON.parse(candidate.desiredDepartments);
      if (Array.isArray(desiredDepartments) && desiredDepartments.length > 0) {
        totalWeight += 30;
        if (desiredDepartments.some((dept: string) => 
          job.department.toLowerCase().includes(dept.toLowerCase())
        )) {
          score += 30;
        }
      }
    } catch (e) {
      // Invalid JSON, skip department matching
    }
  }

  // Employment type match (weight: 20)
  if (candidate.desiredEmploymentTypes) {
    try {
      const desiredTypes = JSON.parse(candidate.desiredEmploymentTypes);
      if (Array.isArray(desiredTypes) && desiredTypes.length > 0) {
        totalWeight += 20;
        if (desiredTypes.includes(job.employmentType)) {
          score += 20;
        }
      }
    } catch (e) {
      // Invalid JSON, skip employment type matching
    }
  }

  // Clearance match (weight: 20)
  if (candidate.clearanceLevel && job.clearanceRequired !== "none") {
    totalWeight += 20;
    const clearanceLevels = ["public-trust", "secret", "top-secret"];
    const candidateLevel = clearanceLevels.indexOf(candidate.clearanceLevel);
    const jobLevel = clearanceLevels.indexOf(job.clearanceRequired);
    if (candidateLevel >= jobLevel) {
      score += 20;
    }
  }

  // If no criteria were set, return a default score based on specialty match
  if (totalWeight === 0) {
    if (candidate.specialty && job.department) {
      return candidate.specialty.toLowerCase().includes(job.department.toLowerCase()) ? 75 : 50;
    }
    return 50; // Default neutral score
  }

  // Normalize score to 0-100 range
  return Math.round((score / totalWeight) * 100);
}

/**
 * Generate match reasons explaining why a job matches a candidate
 */
function generateMatchReasons(candidate: any, job: any, score: number): string[] {
  const reasons: string[] = [];

  // Location match
  if (candidate.desiredLocations) {
    try {
      const desiredLocations = JSON.parse(candidate.desiredLocations);
      if (desiredLocations.some((loc: string) => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      )) {
        reasons.push(`Matches your preferred location: ${job.location}`);
      }
    } catch (e) {}
  }

  // Department match
  if (candidate.desiredDepartments) {
    try {
      const desiredDepartments = JSON.parse(candidate.desiredDepartments);
      if (desiredDepartments.some((dept: string) => 
        job.department.toLowerCase().includes(dept.toLowerCase())
      )) {
        reasons.push(`Matches your preferred department: ${job.department}`);
      }
    } catch (e) {}
  }

  // Employment type match
  if (candidate.desiredEmploymentTypes) {
    try {
      const desiredTypes = JSON.parse(candidate.desiredEmploymentTypes);
      if (desiredTypes.includes(job.employmentType)) {
        reasons.push(`Matches your preferred employment type: ${job.employmentType}`);
      }
    } catch (e) {}
  }

  // Clearance match
  if (candidate.clearanceLevel && job.clearanceRequired !== "none") {
    const clearanceLevels = ["public-trust", "secret", "top-secret"];
    const candidateLevel = clearanceLevels.indexOf(candidate.clearanceLevel);
    const jobLevel = clearanceLevels.indexOf(job.clearanceRequired);
    if (candidateLevel >= jobLevel) {
      reasons.push(`Your ${candidate.clearanceLevel} clearance meets the requirement`);
    }
  }

  // Specialty match
  if (candidate.specialty && job.department.toLowerCase().includes(candidate.specialty.toLowerCase())) {
    reasons.push(`Aligns with your specialty: ${candidate.specialty}`);
  }

  // If no specific reasons, provide general match info
  if (reasons.length === 0) {
    reasons.push(`${score}% overall match based on your profile`);
  }

  return reasons;
}

/**
 * Generate HTML email content for weekly job digest
 */
function generateDigestEmail(candidate: any, matches: any[]): string {
  const candidateName = candidate.name || "there";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Job Matches</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #1f2937;
    }
    .intro {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
    }
    .job-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background-color: #ffffff;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
    }
    .job-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e3a8a;
      margin: 0 0 5px 0;
    }
    .match-badge {
      background-color: #10b981;
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
    }
    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #6b7280;
    }
    .job-meta-item {
      display: flex;
      align-items: center;
    }
    .job-description {
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    .match-reasons {
      background-color: #f0f9ff;
      border-left: 3px solid #3b82f6;
      padding: 12px 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .match-reasons-title {
      font-size: 14px;
      font-weight: 600;
      color: #1e3a8a;
      margin: 0 0 8px 0;
    }
    .match-reasons ul {
      margin: 0;
      padding-left: 20px;
      font-size: 14px;
      color: #1e40af;
    }
    .match-reasons li {
      margin-bottom: 4px;
    }
    .apply-button {
      display: inline-block;
      background-color: #1e3a8a;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 15px;
      transition: background-color 0.2s;
    }
    .apply-button:hover {
      background-color: #1e40af;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .unsubscribe {
      margin-top: 15px;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Your Weekly Job Matches</h1>
      <p>Precision Radiation Oncology Solutions</p>
    </div>
    
    <div class="content">
      <div class="greeting">Hi ${candidateName},</div>
      
      <div class="intro">
        We found <strong>${matches.length} new job ${matches.length === 1 ? 'opportunity' : 'opportunities'}</strong> 
        this week that match your profile. These positions were posted in the last 7 days and align with your 
        preferences and qualifications.
      </div>
      
      ${matches.map(match => `
        <div class="job-card">
          <div class="job-header">
            <div>
              <h2 class="job-title">${match.job.title}</h2>
            </div>
            <div class="match-badge">${match.score}% Match</div>
          </div>
          
          <div class="job-meta">
            <div class="job-meta-item">📍 ${match.job.location}</div>
            <div class="job-meta-item">🏥 ${match.job.department}</div>
            <div class="job-meta-item">💼 ${match.job.employmentType}</div>
            ${match.job.clearanceRequired !== 'none' ? 
              `<div class="job-meta-item">🔒 ${match.job.clearanceRequired}</div>` : ''}
          </div>
          
          <div class="job-description">
            ${match.job.description.substring(0, 200)}${match.job.description.length > 200 ? '...' : ''}
          </div>
          
          <div class="match-reasons">
            <div class="match-reasons-title">Why this matches your profile:</div>
            <ul>
              ${match.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
            </ul>
          </div>
          
          <a href="https://pros-staffing.com/careers/${match.job.id}" class="apply-button">
            View Job & Apply →
          </a>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      <p>
        <strong>Precision Radiation Oncology Solutions</strong><br>
        Elite Talent. Intelligent Systems. Exceptional Care.
      </p>
      <p style="margin-top: 15px;">
        <a href="https://pros-staffing.com/careers">Browse All Jobs</a> | 
        <a href="https://pros-staffing.com/profile/preferences">Update Preferences</a>
      </p>
      <div class="unsubscribe">
        You're receiving this email because you opted in to weekly job match notifications.<br>
        <a href="https://pros-staffing.com/unsubscribe">Unsubscribe from weekly digests</a>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Send weekly job match digest to all candidates
 * 
 * This function:
 * 1. Queries all users with role='user' who have email addresses
 * 2. For each candidate, checks their email preferences (weeklyDigest enabled, minMatchScore threshold)
 * 3. Finds new jobs posted in the past week that match their profile above the threshold
 * 4. Generates professional HTML emails with job details, match scores, and reasons
 * 5. Sends via Resend API and logs to notificationLog table
 * 6. Returns { sent, failed } counts
 */
export async function sendAllWeeklyDigests(): Promise<{ sent: number; failed: number }> {
  console.log("[EmailService] Starting weekly digest batch process...");
  
  let sent = 0;
  let failed = 0;

  try {
    // Get all users with email addresses who have weekly digest enabled
    const candidates = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.role, "user"),
          eq(users.weeklyDigestEnabled, 1),
          sql`${users.email} IS NOT NULL AND ${users.email} != ''`
        )
      );

    console.log(`[EmailService] Found ${candidates.length} candidates with weekly digest enabled`);

    // Get jobs posted in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentJobs = await db
      .select()
      .from(jobs)
      .where(
        and(
          eq(jobs.isActive, 1),
          gte(jobs.postedDate, oneWeekAgo)
        )
      );

    console.log(`[EmailService] Found ${recentJobs.length} jobs posted in the last 7 days`);

    // Process each candidate
    for (const candidate of candidates) {
      try {
        // Calculate match scores for all recent jobs
        const matches = recentJobs
          .map(job => {
            const score = calculateMatchScore(candidate, job);
            const reasons = generateMatchReasons(candidate, job, score);
            return { job, score, reasons };
          })
          .filter(match => match.score >= candidate.minMatchScore)
          .sort((a, b) => b.score - a.score); // Sort by score descending

        // Skip if no matches above threshold
        if (matches.length === 0) {
          console.log(`[EmailService] No matches for ${candidate.email}, skipping`);
          continue;
        }

        // Generate email HTML
        const emailHtml = generateDigestEmail(candidate, matches);

        // Send email via Resend
        const result = await resend.emails.send({
          from: "PROS Careers <careers@pros-staffing.com>",
          to: candidate.email!,
          subject: `🎯 ${matches.length} New Job ${matches.length === 1 ? 'Match' : 'Matches'} This Week`,
          html: emailHtml,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        // Log successful send
        await db.insert(notificationLog).values({
          userId: candidate.id,
          type: "weekly-digest",
          subject: `${matches.length} New Job ${matches.length === 1 ? 'Match' : 'Matches'} This Week`,
          recipientEmail: candidate.email!,
          status: "sent",
          metadata: JSON.stringify({
            jobIds: matches.map(m => m.job.id),
            matchCount: matches.length,
            topScore: matches[0].score,
          }),
        });

        sent++;
        console.log(`[EmailService] ✓ Sent digest to ${candidate.email} (${matches.length} matches)`);

      } catch (error: any) {
        // Log failed send
        await db.insert(notificationLog).values({
          userId: candidate.id,
          type: "weekly-digest",
          subject: "Weekly Job Digest",
          recipientEmail: candidate.email!,
          status: "failed",
          errorMessage: error.message,
        });

        failed++;
        console.error(`[EmailService] ✗ Failed to send digest to ${candidate.email}:`, error.message);
      }
    }

    console.log(`[EmailService] Weekly digest batch complete: ${sent} sent, ${failed} failed`);
    return { sent, failed };

  } catch (error: any) {
    console.error("[EmailService] Fatal error in sendAllWeeklyDigests:", error);
    throw error;
  }
}
