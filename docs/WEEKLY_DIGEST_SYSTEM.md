# Weekly Job Match Digest Email System

## Overview

The PROS website includes an automated email notification system that sends weekly digests to candidates about high-match job opportunities. This system helps keep candidates engaged with relevant job postings while respecting their preferences and privacy.

## Features

### Candidate Preferences
- **Weekly Digest Toggle**: Candidates can enable/disable weekly digest emails
- **Match Score Threshold**: Candidates set minimum match score (0-100) to filter jobs
- **Profile-Based Matching**: Jobs are matched based on:
  - Desired locations
  - Preferred departments
  - Employment type preferences
  - Security clearance level
  - Specialty/expertise

### Email Content
- **Professional HTML Design**: Responsive, mobile-friendly email templates
- **Job Details**: Title, location, department, employment type, clearance requirements
- **Match Scores**: Visual badges showing percentage match (0-100%)
- **Match Reasons**: Bullet-point explanations of why each job matches
- **Direct Apply Links**: One-click navigation to job application pages
- **Preference Management**: Links to update preferences or unsubscribe

### System Capabilities
- **Batch Processing**: Processes all eligible candidates in a single run
- **Error Handling**: Graceful failure handling with detailed logging
- **Database Logging**: All email sends tracked in `notificationLog` table
- **Recent Jobs Only**: Only includes jobs posted in the last 7 days
- **Smart Filtering**: Respects user preferences and match thresholds

## Architecture

### Database Schema

#### Users Table Extensions
```typescript
// Email preferences
weeklyDigestEnabled: int (1 = enabled, 0 = disabled, default: 1)
minMatchScore: int (0-100, default: 70)

// Candidate profile for matching
desiredLocations: text (JSON array)
desiredDepartments: text (JSON array)
desiredEmploymentTypes: text (JSON array)
clearanceLevel: varchar(50)
```

#### Notification Log Table
```typescript
notificationLog {
  id: int (primary key)
  userId: int (recipient)
  type: enum (weekly-digest, application-confirmation, admin-alert, newsletter)
  subject: varchar(500)
  recipientEmail: varchar(320)
  status: enum (sent, failed, bounced)
  errorMessage: text (if failed)
  metadata: text (JSON with job IDs, match count, etc.)
  sentAt: timestamp
}
```

### Core Components

#### 1. Email Service (`server/emailService.ts`)
Main module containing:
- `sendAllWeeklyDigests()`: Main batch processing function
- `calculateMatchScore()`: Scoring algorithm (0-100)
- `generateMatchReasons()`: Explains why jobs match
- `generateDigestEmail()`: Creates HTML email content

#### 2. Execution Script (`scripts/sendWeeklyDigests.mjs`)
Standalone script for scheduled execution:
- Environment variable validation
- Error handling and logging
- Exit codes for monitoring
- Execution statistics

#### 3. Test Script (`scripts/testWeeklyDigests.mjs`)
Testing utility with mock data:
- No credentials required
- Demonstrates matching logic
- Validates scoring algorithm
- Shows expected output format

## Match Scoring Algorithm

The system calculates a match score (0-100) based on weighted criteria:

| Criterion | Weight | Scoring Logic |
|-----------|--------|---------------|
| **Location** | 30% | Candidate's desired locations match job location |
| **Department** | 30% | Candidate's preferred departments match job department |
| **Employment Type** | 20% | Candidate's preferred types include job type |
| **Clearance** | 20% | Candidate's clearance level meets or exceeds requirement |

**Normalization**: Score = (matched_weight / total_weight) × 100

**Fallback**: If no preferences set, uses specialty match (75% match, 50% no match)

### Example Scoring

**Candidate Profile:**
- Desired Locations: ["Washington DC", "Maryland"]
- Desired Departments: ["Medical Physics"]
- Desired Types: ["full-time", "contract"]
- Clearance: "secret"

**Job Posting:**
- Location: "Washington DC"
- Department: "Medical Physics"
- Type: "full-time"
- Clearance: "secret"

**Score Calculation:**
- Location match: 30/30 ✓
- Department match: 30/30 ✓
- Type match: 20/20 ✓
- Clearance match: 20/20 ✓
- **Total: 100/100 = 100% match**

## Usage

### Running the Digest Script

#### Production Environment
```bash
# Set environment variables
export DATABASE_URL="mysql://user:pass@host:port/database"
export RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Run the script
cd /home/ubuntu/pros-website
node --loader tsx/esm scripts/sendWeeklyDigests.mjs
```

#### Expected Output
```
============================================================
PROS Weekly Job Digest Email Script
Started at: 2026-01-18T08:00:00.000Z
============================================================

[EmailService] Starting weekly digest batch process...
[EmailService] Found 150 candidates with weekly digest enabled
[EmailService] Found 12 jobs posted in the last 7 days
[EmailService] No matches for candidate1@example.com, skipping
[EmailService] ✓ Sent digest to candidate2@example.com (3 matches)
[EmailService] ✓ Sent digest to candidate3@example.com (1 match)
...
[EmailService] Weekly digest batch complete: 87 sent, 2 failed

============================================================
✅ Weekly digest batch completed successfully!
   📧 Emails sent: 87
   ❌ Emails failed: 2
   📊 Success rate: 98%
Finished at: 2026-01-18T08:05:32.123Z
============================================================
```

### Testing Without Credentials

```bash
# Run test script with mock data
cd /home/ubuntu/pros-website
node scripts/testWeeklyDigests.mjs
```

This demonstrates the matching logic without requiring database or email credentials.

## Scheduled Execution

### Recommended Schedule
- **Frequency**: Weekly (every Monday at 8:00 AM)
- **Timezone**: User's local timezone or UTC
- **Rationale**: Candidates start their week with fresh opportunities

### Cron Configuration

#### Using System Cron
```bash
# Edit crontab
crontab -e

# Add weekly schedule (Mondays at 8 AM)
0 8 * * 1 cd /home/ubuntu/pros-website && node --loader tsx/esm scripts/sendWeeklyDigests.mjs >> /var/log/weekly-digest.log 2>&1
```

#### Using Manus Schedule Tool
```javascript
// Schedule via Manus platform
schedule({
  type: "cron",
  cron: "0 0 8 * * 1", // Every Monday at 8 AM
  repeat: true,
  name: "Weekly Job Digest",
  prompt: "Send weekly job match digest emails to all candidates. Call the sendAllWeeklyDigests() function from the PROS website email service.",
  playbook: "[See playbook in task description]"
});
```

## Email Service Configuration

### Resend API Setup

1. **Create Resend Account**: https://resend.com
2. **Verify Domain**: Add DNS records for `pros-staffing.com`
3. **Generate API Key**: Create production API key
4. **Set Environment Variable**: `RESEND_API_KEY=re_xxxxxxxxxxxxx`

### Email Sender Configuration

The system sends from:
```
From: PROS Careers <careers@pros-staffing.com>
```

Ensure this email address is verified in your Resend account.

### Rate Limits

Resend free tier limits:
- 100 emails/day
- 3,000 emails/month

For production use, upgrade to paid plan based on candidate volume.

## Monitoring & Logging

### Database Logs

All email sends are logged to `notificationLog` table:

```sql
-- View recent digest sends
SELECT 
  userId,
  recipientEmail,
  status,
  JSON_EXTRACT(metadata, '$.matchCount') as matches,
  sentAt
FROM notificationLog
WHERE type = 'weekly-digest'
ORDER BY sentAt DESC
LIMIT 50;

-- Check failure rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM notificationLog
WHERE type = 'weekly-digest'
  AND sentAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY status;
```

### Application Logs

The script outputs detailed logs to stdout/stderr:
- Candidate processing status
- Match counts per candidate
- Email send success/failure
- Error messages and stack traces

Redirect to log file for persistence:
```bash
node scripts/sendWeeklyDigests.mjs >> /var/log/weekly-digest.log 2>&1
```

### Monitoring Alerts

Set up alerts for:
- **High failure rate**: > 5% failed sends
- **Zero sends**: No emails sent (may indicate system issue)
- **Script errors**: Non-zero exit code
- **Long execution time**: > 10 minutes (may indicate performance issue)

## Troubleshooting

### Common Issues

#### 1. No Emails Sent
**Symptoms**: Script completes but sent = 0

**Possible Causes**:
- No candidates have `weeklyDigestEnabled = 1`
- No jobs posted in last 7 days
- All match scores below candidate thresholds
- Email addresses missing in user records

**Resolution**:
```sql
-- Check candidate preferences
SELECT 
  COUNT(*) as total_users,
  SUM(weeklyDigestEnabled) as digest_enabled,
  SUM(CASE WHEN email IS NOT NULL THEN 1 ELSE 0 END) as has_email
FROM users
WHERE role = 'user';

-- Check recent jobs
SELECT COUNT(*) as recent_jobs
FROM jobs
WHERE isActive = 1
  AND postedDate >= DATE_SUB(NOW(), INTERVAL 7 DAY);
```

#### 2. High Failure Rate
**Symptoms**: Many emails fail to send

**Possible Causes**:
- Invalid email addresses
- Resend API key expired/invalid
- Rate limit exceeded
- Domain not verified

**Resolution**:
1. Check Resend dashboard for error details
2. Verify API key is valid: `echo $RESEND_API_KEY`
3. Check domain verification status
4. Review `notificationLog.errorMessage` for specific errors

#### 3. Database Connection Errors
**Symptoms**: Script exits with "DATABASE_URL is required"

**Possible Causes**:
- Environment variable not set
- Database credentials incorrect
- Database server unreachable

**Resolution**:
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test database connection
mysql -h hostname -u username -p database_name -e "SELECT 1"
```

#### 4. Script Timeout
**Symptoms**: Script runs for very long time or times out

**Possible Causes**:
- Large number of candidates (> 1000)
- Slow database queries
- Network latency to email service

**Resolution**:
- Add batch processing with delays
- Optimize database queries with indexes
- Increase script timeout in scheduler

## Security Considerations

### Email Privacy
- Emails sent individually (no CC/BCC exposure)
- Unsubscribe links included in every email
- User preferences respected at all times

### Data Protection
- Email addresses encrypted in transit (TLS)
- API keys stored in environment variables (not code)
- Database credentials never logged

### Spam Prevention
- Only send to opted-in candidates
- Respect unsubscribe requests immediately
- Include physical mailing address (if required by law)
- Provide clear sender identification

## Future Enhancements

### Planned Features
- [ ] Personalized send time optimization
- [ ] A/B testing for email templates
- [ ] Click tracking and engagement metrics
- [ ] Job recommendation ML model
- [ ] Digest frequency preferences (weekly/biweekly/monthly)
- [ ] Category-specific digests (by specialty)
- [ ] Mobile app push notifications
- [ ] SMS digest option for urgent matches

### Performance Optimizations
- [ ] Batch email sending (reduce API calls)
- [ ] Caching of match scores
- [ ] Parallel processing for large candidate pools
- [ ] Database query optimization with indexes
- [ ] Redis queue for asynchronous processing

## Support

### Documentation
- Main README: `/README.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`
- Database Schema: `/drizzle/schema.ts`

### Contact
- **Technical Issues**: Submit via Manus support portal
- **Email Deliverability**: Contact Resend support
- **Feature Requests**: Create GitHub issue

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0  
**Maintainer**: PROS Development Team
