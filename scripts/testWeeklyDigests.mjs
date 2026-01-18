#!/usr/bin/env node

/**
 * Test Script for Weekly Job Digest Email System
 * 
 * This script demonstrates the weekly digest functionality without
 * requiring actual database or email service credentials.
 * 
 * It simulates the process with mock data to verify the logic works correctly.
 */

console.log('='.repeat(60));
console.log('PROS Weekly Job Digest - Test Mode');
console.log('Started at:', new Date().toISOString());
console.log('='.repeat(60));
console.log();

// Mock data for testing
const mockCandidates = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "user",
    specialty: "Medical Physics",
    organization: "VA Medical Center",
    weeklyDigestEnabled: 1,
    minMatchScore: 70,
    desiredLocations: JSON.stringify(["Washington DC", "Maryland", "Virginia"]),
    desiredDepartments: JSON.stringify(["Medical Physics", "Radiation Oncology"]),
    desiredEmploymentTypes: JSON.stringify(["full-time", "contract"]),
    clearanceLevel: "secret",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "user",
    specialty: "Radiation Therapy",
    organization: "DoD Healthcare",
    weeklyDigestEnabled: 1,
    minMatchScore: 75,
    desiredLocations: JSON.stringify(["California", "Texas"]),
    desiredDepartments: JSON.stringify(["Radiation Therapy"]),
    desiredEmploymentTypes: JSON.stringify(["full-time"]),
    clearanceLevel: "top-secret",
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily.chen@example.com",
    role: "user",
    specialty: "Medical Physics",
    weeklyDigestEnabled: 0, // Disabled - should be skipped
    minMatchScore: 70,
  },
];

const mockJobs = [
  {
    id: 101,
    title: "Senior Medical Physicist - VA Hospital",
    department: "Medical Physics",
    location: "Washington DC",
    employmentType: "full-time",
    clearanceRequired: "secret",
    description: "Seeking an experienced Medical Physicist to join our VA hospital team. Responsibilities include treatment planning, quality assurance, and clinical physics support for radiation oncology department.",
    requirements: "ABR certification, 3+ years experience, active security clearance",
    salaryRange: "$150,000 - $180,000",
    isActive: 1,
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 102,
    title: "Radiation Therapist - Military Treatment Facility",
    department: "Radiation Therapy",
    location: "San Diego, California",
    employmentType: "full-time",
    clearanceRequired: "secret",
    description: "Join our military treatment facility as a Radiation Therapist. Work with state-of-the-art equipment and serve our nation's heroes.",
    requirements: "ARRT(T) certification, 2+ years experience, security clearance eligible",
    salaryRange: "$85,000 - $105,000",
    isActive: 1,
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: 103,
    title: "Medical Physics Consultant - Contract Position",
    department: "Medical Physics",
    location: "Baltimore, Maryland",
    employmentType: "contract",
    clearanceRequired: "public-trust",
    description: "Contract opportunity for experienced Medical Physicist to provide commissioning and QA support for new linear accelerator installation.",
    requirements: "ABR or CAMPEP certification, 5+ years experience, TrueBeam experience preferred",
    salaryRange: "$180/hour",
    isActive: 1,
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 104,
    title: "Chief Physicist - Academic Medical Center",
    department: "Medical Physics",
    location: "Boston, Massachusetts",
    employmentType: "full-time",
    clearanceRequired: "none",
    description: "Lead our radiation oncology physics team at a prestigious academic medical center. Opportunity for research and teaching.",
    requirements: "ABR certification, PhD preferred, 10+ years experience, leadership experience",
    salaryRange: "$200,000 - $250,000",
    isActive: 1,
    postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago - should be excluded
  },
];

// Calculate match score (same logic as emailService.ts)
function calculateMatchScore(candidate, job) {
  let score = 0;
  let totalWeight = 0;

  if (candidate.desiredLocations) {
    try {
      const desiredLocations = JSON.parse(candidate.desiredLocations);
      if (Array.isArray(desiredLocations) && desiredLocations.length > 0) {
        totalWeight += 30;
        if (desiredLocations.some(loc => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        )) {
          score += 30;
        }
      }
    } catch (e) {}
  }

  if (candidate.desiredDepartments) {
    try {
      const desiredDepartments = JSON.parse(candidate.desiredDepartments);
      if (Array.isArray(desiredDepartments) && desiredDepartments.length > 0) {
        totalWeight += 30;
        if (desiredDepartments.some(dept => 
          job.department.toLowerCase().includes(dept.toLowerCase())
        )) {
          score += 30;
        }
      }
    } catch (e) {}
  }

  if (candidate.desiredEmploymentTypes) {
    try {
      const desiredTypes = JSON.parse(candidate.desiredEmploymentTypes);
      if (Array.isArray(desiredTypes) && desiredTypes.length > 0) {
        totalWeight += 20;
        if (desiredTypes.includes(job.employmentType)) {
          score += 20;
        }
      }
    } catch (e) {}
  }

  if (candidate.clearanceLevel && job.clearanceRequired !== "none") {
    totalWeight += 20;
    const clearanceLevels = ["public-trust", "secret", "top-secret"];
    const candidateLevel = clearanceLevels.indexOf(candidate.clearanceLevel);
    const jobLevel = clearanceLevels.indexOf(job.clearanceRequired);
    if (candidateLevel >= jobLevel) {
      score += 20;
    }
  }

  if (totalWeight === 0) {
    if (candidate.specialty && job.department) {
      return candidate.specialty.toLowerCase().includes(job.department.toLowerCase()) ? 75 : 50;
    }
    return 50;
  }

  return Math.round((score / totalWeight) * 100);
}

// Generate match reasons
function generateMatchReasons(candidate, job, score) {
  const reasons = [];

  if (candidate.desiredLocations) {
    try {
      const desiredLocations = JSON.parse(candidate.desiredLocations);
      if (desiredLocations.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      )) {
        reasons.push(`Matches your preferred location: ${job.location}`);
      }
    } catch (e) {}
  }

  if (candidate.desiredDepartments) {
    try {
      const desiredDepartments = JSON.parse(candidate.desiredDepartments);
      if (desiredDepartments.some(dept => 
        job.department.toLowerCase().includes(dept.toLowerCase())
      )) {
        reasons.push(`Matches your preferred department: ${job.department}`);
      }
    } catch (e) {}
  }

  if (candidate.desiredEmploymentTypes) {
    try {
      const desiredTypes = JSON.parse(candidate.desiredEmploymentTypes);
      if (desiredTypes.includes(job.employmentType)) {
        reasons.push(`Matches your preferred employment type: ${job.employmentType}`);
      }
    } catch (e) {}
  }

  if (candidate.clearanceLevel && job.clearanceRequired !== "none") {
    const clearanceLevels = ["public-trust", "secret", "top-secret"];
    const candidateLevel = clearanceLevels.indexOf(candidate.clearanceLevel);
    const jobLevel = clearanceLevels.indexOf(job.clearanceRequired);
    if (candidateLevel >= jobLevel) {
      reasons.push(`Your ${candidate.clearanceLevel} clearance meets the requirement`);
    }
  }

  if (candidate.specialty && job.department.toLowerCase().includes(candidate.specialty.toLowerCase())) {
    reasons.push(`Aligns with your specialty: ${candidate.specialty}`);
  }

  if (reasons.length === 0) {
    reasons.push(`${score}% overall match based on your profile`);
  }

  return reasons;
}

// Simulate the digest process
let sent = 0;
let failed = 0;
let skipped = 0;

// Filter jobs posted in last 7 days
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const recentJobs = mockJobs.filter(job => job.postedDate >= oneWeekAgo);

console.log(`📊 Found ${mockCandidates.length} total candidates`);
console.log(`📊 Found ${recentJobs.length} jobs posted in the last 7 days`);
console.log();

for (const candidate of mockCandidates) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Processing: ${candidate.name} (${candidate.email})`);
  
  if (!candidate.weeklyDigestEnabled) {
    console.log(`⏭️  Skipped - Weekly digest disabled`);
    skipped++;
    continue;
  }

  // Calculate matches
  const matches = recentJobs
    .map(job => {
      const score = calculateMatchScore(candidate, job);
      const reasons = generateMatchReasons(candidate, job, score);
      return { job, score, reasons };
    })
    .filter(match => match.score >= candidate.minMatchScore)
    .sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    console.log(`⏭️  Skipped - No matches above threshold (${candidate.minMatchScore}%)`);
    skipped++;
    continue;
  }

  console.log(`✅ Found ${matches.length} matching job(s):`);
  matches.forEach((match, index) => {
    console.log(`   ${index + 1}. ${match.job.title} - ${match.score}% match`);
    match.reasons.forEach(reason => {
      console.log(`      • ${reason}`);
    });
  });

  console.log(`📧 Would send email: "${matches.length} New Job Match${matches.length > 1 ? 'es' : ''} This Week"`);
  sent++;
}

console.log();
console.log('='.repeat(60));
console.log('📊 Test Results Summary:');
console.log(`   ✅ Emails that would be sent: ${sent}`);
console.log(`   ⏭️  Candidates skipped: ${skipped}`);
console.log(`   ❌ Failures: ${failed}`);
console.log(`   📈 Success rate: ${sent + failed > 0 ? Math.round((sent / (sent + failed)) * 100) : 100}%`);
console.log();
console.log('✅ Test completed successfully!');
console.log('Finished at:', new Date().toISOString());
console.log('='.repeat(60));
