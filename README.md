# Precision Radiation Oncology Solutions (PROS)

**Elite Talent. Intelligent Systems. Exceptional Care.**

Professional website and content platform for a veteran-owned radiation oncology staffing and AI solutions company serving VA, DoD, and civilian healthcare facilities.

---

## 🎯 Project Overview

PROS is a comprehensive web platform designed to:
- **Generate leads** through authentication-gated professional tools
- **Attract talent** via integrated job board with application system
- **Build authority** through publication-quality technical blog content
- **Engage professionals** with biweekly newsletter on industry trends
- **Support government contracting** with VOSB/CMMC/NIST compliance messaging

---

## ✨ Key Features

### Lead Magnet Tools (Authentication Required)
1. **Staffing Calculator** - ASTRO/AAPM TG-268 compliant FTE calculations
2. **BED Calculator** - Comprehensive biological dose calculator with tissue presets, EQD2, fractionation comparison, and PDF export
3. **Protocol Library** - Searchable treatment protocols database with favorites and export
4. **QA Checklist Generator** - TG-142, TG-51, TG-100 templates with interactive tracking
5. **Resource Aggregator** - Curated links to journals, conferences, guidelines, and education

### Job Board System
- Job listings with advanced filters (location, specialty, clearance level)
- Individual job detail pages with integrated application forms
- Resume upload to S3 storage with validation
- Admin dashboard for managing postings and reviewing applications
- AI-powered resume analysis and job matching

### Blog & Content
- Publication-quality technical articles (5,000+ words each)
- Category and tag filtering
- Related articles suggestions
- View tracking and engagement metrics
- SEO-optimized with proper meta tags

### Newsletter System
- Biweekly newsletter with multiple articles per issue
- Email subscription management
- Archive of past issues
- Admin interface for publishing

### Admin Dashboard
- Statistics overview (jobs, applications, contacts, users)
- AI-powered features via aimlapi.com:
  - Job description generation
  - Resume analysis and candidate matching
  - Contact inquiry response suggestions
  - Chat assistant for content generation
- Full CRUD for jobs, protocols, blog posts, newsletters

---

## 🛠 Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- TailwindCSS 4 for styling
- Wouter for routing
- shadcn/ui component library

**Backend:**
- Express.js server
- tRPC for type-safe API
- Drizzle ORM for database
- TiDB/MySQL database
- S3 for file storage

**Authentication:**
- NextAuth.js with Manus OAuth
- Role-based access control (admin/user)
- Session-based authentication

**AI Integration:**
- aimlapi.com for content generation
- Resume analysis and matching
- Job description generation
- Chat assistant

**Deployment:**
- Vercel hosting
- Manus platform for environment management
- GitHub for version control

---

## 📁 Project Structure

```
pros-website/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable UI components
│       ├── lib/           # tRPC client and utilities
│       └── index.css      # Global styles and theme
├── server/                # Backend Express + tRPC
│   ├── _core/            # Framework plumbing (OAuth, context)
│   ├── db.ts             # Database query helpers
│   └── routers.ts        # tRPC API procedures
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Table definitions
├── shared/               # Shared types and constants
├── docs/                 # Documentation
│   └── DEPLOYMENT.md     # Deployment guide
└── todo.md              # Feature tracking
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- Manus platform account (for environment variables)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pros-website

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

All environment variables are automatically injected by the Manus platform:
- Database connection (`DATABASE_URL`)
- OAuth configuration (`VITE_APP_ID`, `OAUTH_SERVER_URL`)
- API keys (`BUILT_IN_FORGE_API_KEY`, `AIMLAPI_KEY`)
- Application settings (`VITE_APP_TITLE`, `VITE_APP_LOGO`)

See `server/_core/env.ts` for the complete list.

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts with role-based access
- **jobs** - Job postings with clearance requirements
- **applications** - Job applications with S3 resume URLs
- **contacts** - Contact form submissions
- **blogPosts** - Technical articles with categories/tags
- **protocols** - Treatment protocol library
- **qaTemplates** - QA checklist templates
- **newsletters** - Newsletter issues and articles
- **newsletterSubscribers** - Email subscription list

### Managing Schema

```bash
# Update schema in drizzle/schema.ts, then:
pnpm db:push
```

This generates migrations and applies them to the database.

---

## 🎨 Branding

**Colors:**
- Primary: Navy Blue (#1e3a8a)
- Secondary: Light Blue (#3b82f6)
- Accent: Gold (#f59e0b)
- Background: White (#ffffff)
- Text: Dark Gray (#1f2937)

**Typography:**
- Headings: Montserrat (Google Fonts)
- Body: Roboto (Google Fonts)

**Logo:**
- Controlled via `APP_LOGO` constant in `client/src/const.ts`
- Favicon managed separately via Management UI

---

## 🔒 Security

### Authentication
- All tools require user login for lead generation
- Admin routes protected by role-based access control
- Session cookies signed with `JWT_SECRET`

### File Uploads
- Resume validation (PDF/Word only, 5MB max)
- S3 storage with non-enumerable paths
- User-specific file keys

### API Security
- tRPC procedures use `protectedProcedure` for auth
- Admin procedures check `ctx.user.role === 'admin'`
- Rate limiting recommended for production

---

## 📝 Content Strategy

### Blog Articles (5,000+ words each)
1. ✅ **PSQA Optimization** - The 40% solution for cutting QA time
2. ⏳ **Staffing Crisis Solutions** - Evidence-based staffing models
3. ⏳ **AI Treatment Planning** - Practical implementation guide
4. ⏳ **TG-100 Risk Management** - Quality management systems
5. ⏳ **Hypofractionation Protocols** - Evidence-based regimens

**Writing Standards:**
- Zero-trust methodology (all claims verified and cited)
- Minimum 10 peer-reviewed references per article
- Magazine-style format (engaging hooks, practical focus)
- Author: Kimal Honour Djam, Director of Physics

### Newsletter Topics
- Industry news (FDA approvals, new technologies)
- Clinical updates (trial results, guideline changes)
- Staffing insights (market trends, career advice)
- Technology spotlight (AI applications, workflow optimization)

---

## 🚢 Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for comprehensive deployment instructions.

**Quick Deploy:**
1. Save checkpoint in Manus platform
2. Click "Publish" button in Management UI
3. Configure custom domain (optional)
4. Add Mailgun credentials for email notifications
5. Populate sample data (jobs, protocols, blog articles)

---

## 📈 Analytics & Monitoring

### Built-in Analytics
- UV (unique visitors) and PV (page views)
- User registration tracking
- Tool usage metrics
- Job application funnel

### Custom Events
- Tool usage by type
- Job application submissions
- Newsletter signups
- Contact form inquiries by type

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

---

## 📞 Support

### Manus Platform
- Documentation: [https://help.manus.im](https://help.manus.im)
- Submit issues via support portal

### Project Maintainer
- **Company**: Precision Radiation Oncology Solutions
- **Contact**: info@pros-staffing.com
- **Website**: [Coming Soon]

---

## 📄 License

Proprietary - All rights reserved by Precision Radiation Oncology Solutions

---

## 🗺 Roadmap

### Immediate (Post-Launch)
- [ ] Deploy to Vercel with custom domain
- [ ] Add Mailgun credentials for email notifications
- [ ] Populate 3-5 sample job postings
- [ ] Add 10-15 treatment protocols to library
- [ ] Publish 5 technical blog articles
- [ ] Create first newsletter issue

### Short-term (1-3 months)
- [ ] Integrate Google Analytics for detailed tracking
- [ ] Add candidate portal for application tracking
- [ ] Implement job search functionality
- [ ] Create resources section (whitepapers, guides)
- [ ] Add testimonials and case studies
- [ ] Build AI chat assistant widget

### Medium-term (3-6 months)
- [ ] Automated job import from external sources
- [ ] Advanced resume parsing and matching
- [ ] Video testimonials from placed candidates
- [ ] Webinar registration and hosting
- [ ] Mobile app for job seekers
- [ ] API for third-party integrations

### Long-term (6-12 months)
- [ ] Credentialing management system
- [ ] Continuing education platform
- [ ] Community forum for radiation oncology professionals
- [ ] Marketplace for locum tenens positions
- [ ] Integration with VA/DoD contracting systems

---

**Built with ❤️ for the radiation oncology community**
