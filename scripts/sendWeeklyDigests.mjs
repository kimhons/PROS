#!/usr/bin/env node

/**
 * Weekly Job Digest Email Script
 * 
 * This script sends weekly job match digest emails to all candidates
 * who have opted in to receive them.
 * 
 * Usage:
 *   node --loader tsx/esm scripts/sendWeeklyDigests.mjs
 * 
 * Environment Variables Required:
 *   - DATABASE_URL: MySQL connection string
 *   - RESEND_API_KEY: Resend API key for sending emails
 * 
 * This script is designed to be run as a scheduled task (e.g., via cron)
 * to send weekly digest emails every Monday morning.
 */

import { sendAllWeeklyDigests } from '../server/emailService.js';

async function main() {
  console.log('='.repeat(60));
  console.log('PROS Weekly Job Digest Email Script');
  console.log('Started at:', new Date().toISOString());
  console.log('='.repeat(60));
  console.log();

  // Check for required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL environment variable is not set');
    console.error('Please set DATABASE_URL before running this script.');
    process.exit(1);
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY environment variable is not set');
    console.error('Please set RESEND_API_KEY before running this script.');
    process.exit(1);
  }

  try {
    // Execute the weekly digest function
    const result = await sendAllWeeklyDigests();

    console.log();
    console.log('='.repeat(60));
    console.log('✅ Weekly digest batch completed successfully!');
    console.log(`   📧 Emails sent: ${result.sent}`);
    console.log(`   ❌ Emails failed: ${result.failed}`);
    console.log(`   📊 Success rate: ${result.sent + result.failed > 0 ? Math.round((result.sent / (result.sent + result.failed)) * 100) : 0}%`);
    console.log('Finished at:', new Date().toISOString());
    console.log('='.repeat(60));

    // Exit with appropriate code
    process.exit(result.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error();
    console.error('='.repeat(60));
    console.error('❌ FATAL ERROR: Weekly digest batch failed');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

// Run the script
main();
