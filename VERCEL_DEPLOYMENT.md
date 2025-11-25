# Vercel Deployment Guide

## Quick Deploy

Your PROS website is now on GitHub and ready to deploy to Vercel!

**GitHub Repository:** https://github.com/kimhons/PROS

---

## Step 1: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. Find and select the **"PROS"** repository from the list
4. Click **"Import"**

---

## Step 2: Configure Project Settings

### Framework Preset
- **Framework:** Vite
- **Root Directory:** `./` (leave as default)
- **Build Command:** `pnpm build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `pnpm install` (auto-detected)

### Environment Variables

Click **"Environment Variables"** and add the following:

#### Required System Variables (from Manus)
```
DATABASE_URL=<your_tidb_connection_string>
JWT_SECRET=<random_secret_key>
VITE_APP_ID=<manus_app_id>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal
OWNER_OPEN_ID=<your_openid>
OWNER_NAME=<your_name>
VITE_APP_TITLE=PROS - Precision Radiation Oncology Solutions
VITE_APP_LOGO=/logo.svg
BUILT_IN_FORGE_API_URL=<manus_forge_url>
BUILT_IN_FORGE_API_KEY=<manus_forge_key>
VITE_FRONTEND_FORGE_API_KEY=<manus_frontend_key>
VITE_FRONTEND_FORGE_API_URL=<manus_frontend_url>
VITE_ANALYTICS_ENDPOINT=<analytics_endpoint>
VITE_ANALYTICS_WEBSITE_ID=<website_id>
```

#### Optional - Mailgun (for email notifications)
```
MAILGUN_API_KEY=<your_mailgun_api_key>
MAILGUN_DOMAIN=<your_mailgun_domain>
```

**To get these values from your Manus project:**
1. Open the Management UI (right panel)
2. Go to **Settings** → **Secrets**
3. Copy each environment variable value
4. Paste into Vercel's environment variables

---

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at `https://pros-<random>.vercel.app`

---

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `pros-staffing.com`)
4. Follow Vercel's DNS configuration instructions

---

## Step 5: Set Up Database

Your TiDB database is already configured in Manus. The connection string in `DATABASE_URL` will work automatically.

**Database Schema:**
- Already migrated via Drizzle ORM
- 13 tables created (users, jobs, applications, contacts, protocols, blog posts, notifications, etc.)
- Sample data already seeded (12 protocols, 3 blog posts)

---

## Troubleshooting

### Build Fails
- **Check Node version:** Vercel should use Node 18+ automatically
- **Check environment variables:** Ensure all required variables are set
- **Check build logs:** Look for specific error messages in Vercel dashboard

### Database Connection Issues
- **Verify DATABASE_URL:** Must be a valid MySQL/TiDB connection string
- **Check SSL:** TiDB requires SSL, ensure `?ssl={"rejectUnauthorized":true}` is in connection string
- **Test locally:** Run `pnpm db:push` to verify connection

### OAuth/Login Issues
- **Check OAUTH_SERVER_URL:** Must be `https://api.manus.im`
- **Verify VITE_APP_ID:** Must match your Manus application ID
- **Update redirect URLs:** Add your Vercel domain to Manus OAuth settings

---

## Post-Deployment Checklist

- [ ] Visit your Vercel URL and verify homepage loads
- [ ] Test login functionality
- [ ] Check admin dashboard access
- [ ] Verify Protocol Library displays 12 protocols
- [ ] Test blog page shows 3 articles
- [ ] Confirm job board is accessible
- [ ] Test contact form submission
- [ ] Verify newsletter subscription works

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your commit message"
git push github main

# Vercel will automatically build and deploy
```

---

## Alternative: Deploy via Manus

If you prefer to use Manus's built-in deployment:

1. Click the **"Publish"** button in the Management UI (top-right)
2. Your site deploys automatically with all environment variables pre-configured
3. No manual Vercel setup required

---

## Support

- **Vercel Documentation:** https://vercel.com/docs
- **GitHub Repository:** https://github.com/kimhons/PROS
- **Manus Support:** https://help.manus.im
