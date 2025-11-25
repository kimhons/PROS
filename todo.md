# PROS Website TODO

## Phase 1: Core Pages & Branding
- [x] Update branding (logo, colors, fonts) in index.css and index.html
- [x] Design and implement professional homepage with hero section
- [x] Create "About Us" page with mission, vision, values
- [x] Create "Services" page (Staffing + AI Solutions)
- [x] Create "Government Contracting" page (VOSB, certifications, capabilities)
- [ ] Create "Contact" page with form
- [ ] Implement responsive navigation header
- [ ] Implement footer with links and certifications

## Phase 2: Job Board Integration
- [ ] Design database schema for jobs (positions, applications)
- [ ] Create job listing page with filters (location, specialty, clearance)
- [ ] Create individual job detail pages
- [ ] Implement job application form with file upload (resume, certifications)
- [ ] Create admin dashboard for managing job postings
- [ ] Implement automated job import/sync from external sources
- [ ] Add email notifications for new applications

## Phase 3: Advanced Features
- [ ] Create candidate portal (login, profile, application tracking)
- [ ] Implement search functionality for jobs
- [ ] Add blog/news section for company updates
- [ ] Create resources section (guides, whitepapers on government contracting)
- [ ] Implement analytics tracking for job views and applications
- [ ] Add testimonials/case studies section

## Phase 4: Polish & Launch
- [ ] SEO optimization (meta tags, sitemap, robots.txt)
- [ ] Performance optimization (image compression, lazy loading)
- [ ] Accessibility audit and fixes
- [ ] Cross-browser testing
- [ ] Mobile responsiveness review
- [ ] Security audit
- [ ] Create capability statement PDF download
- [ ] Final content review and copywriting

## New User Requests
- [x] Update organizational documentation with detailed service descriptions (300 char limit)
- [x] Create comprehensive Services page with all five service categories
- [x] Add detailed mission statement to About page

## Newsletter & Market Expansion
- [ ] Update all pages to include civilian hospitals (academic medical centers, community hospitals, private practices)
- [ ] Create newsletter database schema (issues, articles, subscribers)
- [ ] Build newsletter archive page with issue listings
- [ ] Create individual newsletter issue page with article layout
- [ ] Add newsletter signup form to homepage
- [ ] Create admin interface for publishing newsletters
- [ ] Add newsletter subscription management
- [ ] Add tagline "Elite Talent. Intelligent Systems. Exceptional Care." throughout website

## Radiation Oncology Web Apps (Lead Magnets - Authentication Required)
- [x] Create "Tools" landing page showcasing all five apps
- [x] Build Staffing Calculator (ASTRO/AAPM guidelines) with FTE calculations
- [x] Build comprehensive BED Calculator with tissue presets
- [ ] Build Protocol Library with searchable database and PDF downloads
- [ ] Build QA Checklist Generator (AAPM/ASTRO/MPPG based)
- [ ] Build Resource Aggregator with curated links and categories
- [ ] Enhance user registration to capture credentials and organization
- [ ] Add app usage tracking for lead scoring
- [x] Add PDF export feature to BED Calculator for clinical documentation
- [x] Add standard fractionation schedule comparison feature to BED Calculator
- [x] Build Protocol Library with searchable database, filters, and PDF export
- [x] Build QA Checklist Generator with TG-142, TG-51, and TG-100 templates
- [x] Build Resource Aggregator with curated links to journals, conferences, guidelines, and professional development resources
- [x] Create Contact page with multi-purpose inquiry form (staffing, consultations, partnerships)
- [x] Build job detail page with application form and resume upload to S3
- [x] Build admin dashboard with job management, application tracking, and contact form management
- [x] Integrate aimlapi.com for AI-powered features
- [ ] Build AI chat assistant widget for website navigation and support
- [x] Implement AI resume analysis and job matching
- [x] Add AI-assisted content generation for admin dashboard
- [x] Research 20 pain points in radiation oncology
- [x] Design blog system with database schema for articles, categories, and tags
- [ ] Create 20 technically detailed, actionable blog articles as lead magnets
- [x] Build blog listing page with search and filtering
- [x] Build individual blog article pages with related content suggestions
- [x] Add blog section to main navigation
- [ ] Generate 5 sample articles (3500+ words each) using multi-section approach with publication-quality standards
- [ ] Review sample articles and generate remaining 15 articles after approval
- [x] Enhance blog post template with publication-quality formatting (citations, tables, formulas)
- [ ] Regenerate 5 articles in magazine format (Practical Radiation Oncology style) with verified claims, engaging storytelling, practical focus, and proper equation formatting

## Deployment & Documentation
- [x] Create comprehensive README.md with project overview
- [x] Create detailed DEPLOYMENT.md guide with Vercel instructions
- [x] Create QUICKSTART.md for rapid deployment
- [x] Create ENV_TEMPLATE.md with environment variable reference
- [x] Configure vercel.json for production deployment
- [x] Organize project documentation in docs/ folder
- [ ] Deploy to Vercel via Management UI Publish button
- [ ] Configure custom domain (prosradiationoncology.com)
- [ ] Add Mailgun credentials for email notifications
- [ ] Populate 3-5 sample job postings
- [ ] Add 10-15 treatment protocols to Protocol Library
- [ ] Publish 5 comprehensive blog articles (5,000+ words each)
- [ ] Create first newsletter issue
- [ ] Test all features in production environment

## Real-Time Notification System
- [x] Design notification system architecture (polling-based with EventEmitter)
- [x] Create notifications database table for persistence
- [x] Implement backend notification service with event emitter
- [x] Create notification tRPC procedures (list, mark as read, delete, unreadCount)
- [x] Build NotificationBell component with badge counter
- [x] Build NotificationPanel component with history list
- [x] Implement toast notifications for new applications
- [x] Integrate notifications into admin dashboard header
- [x] Emit notification events when new applications are submitted
- [x] Add getAdminUsers helper to notify all admins
- [ ] Test real-time notification delivery with actual application submission
- [ ] Add notification preferences (sound toggle, desktop notifications)
- [ ] Add notification for new contact inquiries
