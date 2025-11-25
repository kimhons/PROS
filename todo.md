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

## Notification Bell Animation
- [x] Add CSS keyframes for bell ring animation
- [x] Add pulse animation for notification badge
- [x] Implement animation trigger when new notifications arrive
- [x] Auto-stop animation after 3 seconds
- [x] Stop animation when user clicks the bell

## Daily Notification Digest Email
- [ ] Create HTML email template for notification digest
- [ ] Implement digest generation logic (group notifications by type)
- [ ] Add email sending function using existing email service
- [ ] Create scheduled task to send digest daily at 8 AM
- [ ] Add admin preferences table for digest settings
- [ ] Add UI for admins to configure digest preferences (enable/disable, time)
- [ ] Only send digest if there are unread notifications
- [ ] Include direct links to notifications in email
- [ ] Test digest email delivery

## Public Job Board
- [ ] Create job listings page (/careers)
- [ ] Build job card component with key details
- [ ] Add search functionality for job titles and descriptions
- [ ] Implement filter sidebar (department, location, employment type, clearance)
- [ ] Create individual job detail page (/careers/[id])
- [ ] Build application form component with resume upload
- [ ] Add form validation and error handling
- [ ] Implement application submission with file upload to S3
- [ ] Add success confirmation page/modal after application
- [ ] Make job board responsive for mobile devices
- [ ] Add "no results" state for empty searches
- [ ] Add loading states for job fetching

## Admin Dashboard Pages
- [x] Build Jobs Management page (/admin/jobs)
  - [x] Job listing table with search and filters
  - [x] Create new job form
  - [x] Edit existing job form
  - [x] Activate/deactivate jobs
  - [x] Delete jobs
- [x] Build Applications Review page (/admin/applications)
  - [x] Application listing table with filters
  - [x] View application details
  - [x] Download resumes
  - [x] Update application status
  - [x] Search by applicant name or job title
- [x] Build Contacts Management page (/admin/contacts)
  - [x] Contact inquiry listing table
  - [x] Filter by inquiry type and status
  - [x] View contact details
  - [x] Update contact status (new/contacted/resolved)
  - [ ] AI-assisted response generation
- [x] Build Subscribers Management page (/admin/subscribers)
  - [x] Subscriber listing table
  - [x] Filter by status (active/unsubscribed)
  - [x] Export subscriber list to CSV
  - [x] View subscription date and source
- [x] Build Blog Management page (/admin/blog)
  - [x] Blog post listing table
  - [ ] Create new blog post form
  - [ ] Edit existing blog posts
  - [x] Publish/unpublish posts
  - [x] Delete posts
  - [x] Preview posts before publishing
- [x] Register all admin routes in App.tsx
- [ ] Update DashboardLayout sidebar navigation with admin pages

## Rich Text Blog Editor
- [x] Install markdown editor packages (react-markdown, remark-gfm)
- [x] Create MarkdownEditor component with toolbar
- [x] Add markdown formatting buttons (headings, bold, italic, lists, links, code)
- [x] Implement live preview panel with split-screen layout
- [x] Build image upload component with drag-and-drop
- [x] Integrate S3 image upload for blog post images
- [x] Create blog post creation page (/admin/blog/new)
- [x] Create blog post editing page (/admin/blog/edit/:id)
- [x] Implement slug auto-generation from title
- [x] Add category and tags input fields
- [x] Add publish/draft save options
- [x] Add form validation and error handling
- [x] Update BlogManagement page with "Create Post" and "Edit" buttons
- [x] Add tRPC procedures for getById, create, update, uploadImage
- [ ] Test editor with actual blog post creation and editing
- [ ] Add auto-save draft functionality (optional enhancement)

## Approved Enhancements
- [x] Update DashboardLayout sidebar with navigation links to all admin pages
  - [x] Add Jobs management link
  - [x] Add Applications link
  - [x] Add Contacts link
  - [x] Add Subscribers link
  - [x] Add Blog management link
- [x] Implement auto-save functionality in blog editor
  - [x] Add periodic auto-save (every 30 seconds)
  - [x] Store drafts in localStorage
  - [x] Add "restore draft" prompt when opening editor
  - [x] Clear saved draft after successful publish
  - [x] Add auto-save timestamp indicator
  - [x] Add discard draft option
- [x] Create three sample blog posts on radiation oncology topics
  - [x] Post 1: Optimizing SBRT Treatment Planning for Lung Cancer
  - [x] Post 2: Implementing PSQA Workflows Best Practices
  - [x] Post 3: Future of Adaptive Radiation Therapy with AI/ML

## Protocol Library Population
- [x] Create 12 sample treatment protocols
  - [x] IMRT protocols (Head & Neck, Prostate, Breast)
  - [x] VMAT protocols (Esophagus, Rectum)
  - [x] SRS protocols (Brain single/multiple metastases)
  - [x] SBRT protocols (Lung peripheral/central, Liver, Spine, Pancreas)
  - [x] Include technical specifications and dose constraints
  - [x] Insert protocols into database

## GitHub & Vercel Deployment
- [ ] Commit all changes to GitHub
- [ ] Push to main branch
- [ ] Deploy to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Verify deployment
