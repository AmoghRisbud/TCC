# TCC Frontend - Vercel + Upstash Redis Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- [x] GitHub repository: `AmoghRisbud/TCC_frontend`
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Upstash account (sign up at [console.upstash.com](https://console.upstash.com))
- [ ] Gmail account with app password configured
- [ ] Google OAuth credentials configured

---

## Step 1: Setup Upstash Redis (10 minutes)

### 1.1 Create Upstash Account
1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign up using GitHub (recommended for quick setup)
3. Verify email if required

### 1.2 Create Redis Database
1. Click **"Create Database"**
2. Configure:
   - **Name**: `tcc-production`
   - **Type**: Regional
   - **Region**: `us-east-1` (closest to Vercel)
   - **TLS**: Enabled (default)
   - **Eviction**: noeviction
3. Click **"Create"**

### 1.3 Get Connection Details
1. Click on your database name
2. Scroll to **"REST API"** section
3. Copy these values (you'll need them for Vercel):
   ```
   UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXXXxxxXXXxxx

   UPSTASH_REDIS_REST_URL="https://peaceful-elk-39663.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AZrvAAIncDEyOTBkZTgyODAwNWU0YjU4ODE0MjExMjU5MjhkOWJlM3AxMzk2NjM"
   ```
4. Also get the **ioredis connection string**:
   ```
   REDIS_URL=redis://default:AZrvAAIncDEyOTBkZTgyODAwNWU0YjU4ODE0MjExMjU5MjhkOWJlM3AxMzk2NjM@peaceful-elk-39663.upstash.io:6379
   ```

### 1.4 Configure Database Settings
1. In Upstash Console → Database → **Settings**:
   - **Eviction Policy**: `noeviction` (prevent data loss)
   - **Persistence**: Enable daily backups
   - **Max Memory**: 256MB (Free tier default)

---

## Step 2: Deploy to Vercel (15 minutes)

### 2.1 Import Repository
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select **"AmoghRisbud/TCC_frontend"**
4. Click **"Import"**

### 2.2 Configure Project
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (default)
Output Directory: .next (default)
Install Command: npm install (default)
```

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

````env
# Authentication
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Admin Access
ADMIN_EMAILS=info.thecollectivecounsel@gmail.com,admin2@example.com

# Redis (from Upstash - Step 1.3)
REDIS_URL=rediss://default:PASSWORD@endpoint.upstash.io:6379

# Email Service
EMAIL_USER=careersthecollectivecounsel@gmail.com
EMAIL_PASSWORD=<your-gmail-app-password>

# Optional
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
````

**Important**: Set environment for **Production**, **Preview**, and **Development**

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://your-project.vercel.app`

---

## Step 3: Update OAuth Callback URLs (5 minutes)

### 3.1 Update Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add **Authorized redirect URIs**:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   https://*.vercel.app/api/auth/callback/google
   ```
4. Add **Authorized JavaScript origins**:
   ```
   https://your-project.vercel.app
   https://*.vercel.app
   ```
5. Click **"Save"**

---

## Step 4: Migrate Content to Redis (5 minutes)

### 4.1 Run Migration
````powershell
# Option A: Using curl
curl -X POST https://your-project.vercel.app/api/admin/migrate

# Option B: Using browser
# 1. Sign in: https://your-project.vercel.app/auth/signin
# 2. Go to: https://your-project.vercel.app/admin
# 3. Click "Migrate Content to Redis" button
````

### 4.2 Verify Migration
**Expected Response**:
````json
{
  "success": true,
  "migrated": {
    "programs": 1,
    "research": 7,
    "testimonials": 2,
    "gallery": 3,
    "careers": 5,
    "announcements": 2
  }
}
````

### 4.3 Verify in Upstash Console
1. Go to Upstash Console → Your Database → **Data Browser**
2. Check these keys exist:
   - `tcc:programs`
   - `tcc:research`
   - `tcc:testimonials`
   - `tcc:gallery`
   - `tcc:careers`
   - `tcc:announcements`

---

## Step 5: Post-Deployment Verification (10 minutes)

### 5.1 Test Public Pages
- [ ] https://your-project.vercel.app (home page)
- [ ] https://your-project.vercel.app/programs
- [ ] https://your-project.vercel.app/research
- [ ] https://your-project.vercel.app/careers
- [ ] https://your-project.vercel.app/about

### 5.2 Test Authentication
- [ ] Visit: https://your-project.vercel.app/auth/signin
- [ ] Sign in with Google OAuth
- [ ] Verify admin dashboard access: https://your-project.vercel.app/admin
- [ ] Test logout

### 5.3 Test Admin Functions
- [ ] Create/edit/delete a program
- [ ] Create/edit/delete a research article
- [ ] Create/edit/delete a testimonial
- [ ] Upload an image
- [ ] Create a career posting

### 5.4 Test Email Service
- [ ] Visit: https://your-project.vercel.app/careers
- [ ] Submit a test CV application
- [ ] Verify email received at `info.thecollectivecounsel@gmail.com`
- [ ] Check email has CV attachment

### 5.5 Check Performance
- [ ] Open browser DevTools → Network
- [ ] Reload pages and check load times
- [ ] Verify images load correctly
- [ ] Check for any 404 errors

---

## Step 6: Backup Strategy (5 minutes)

### 6.1 Create Initial Backup
````powershell
# Run backup script
npm run backup-redis

# Expected output:
# ✅ Backup completed successfully!
# 📁 File: backups/redis-backup-YYYY-MM-DD.json
````

### 6.2 Schedule Regular Backups
**Weekly backups recommended**:
````powershell
# Add to your calendar/reminders
# Every Sunday: npm run backup-redis
````

### 6.3 Test Restore (Optional)
````powershell
# Restore from backup
npm run restore-redis backups/redis-backup-YYYY-MM-DD.json
````

---

## Step 7: Configure Custom Domain (Optional - 10 minutes)

### 7.1 Add Domain in Vercel
1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `thecollectivecounsel.com`
4. Click **"Add"**

### 7.2 Configure DNS
Add these records at your domain registrar:

**For root domain**:
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 Update Environment Variables
Update `NEXTAUTH_URL` in Vercel:
```
NEXTAUTH_URL=https://thecollectivecounsel.com
```

### 7.4 Update OAuth Callbacks
Add your custom domain to Google OAuth:
```
https://thecollectivecounsel.com/api/auth/callback/google
```

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Module not found: ioredis`
````bash
# Solution: Verify package.json has ioredis
npm install ioredis
git commit -am "Add ioredis dependency"
git push
````

**Error**: `Type error: Cannot find module`
````bash
# Solution: Check TypeScript configuration
npm run typecheck
````

### Redis Connection Fails

**Error**: `Redis ping timeout`
````bash
# Check:
# 1. REDIS_URL in Vercel environment variables
# 2. Upstash database is running (check console)
# 3. URL format: rediss://default:PASSWORD@endpoint:6379
````

**Error**: `ECONNREFUSED`
````bash
# Solution: Verify TLS is enabled in Redis URL
# Must use rediss:// (with double 's')
````

### Authentication Issues

**Error**: `No OAuth provider configured`
````bash
# Check:
# 1. GOOGLE_CLIENT_ID is set in Vercel
# 2. GOOGLE_CLIENT_SECRET is set in Vercel
# 3. Callback URLs match in Google Console
````

**Error**: `NEXTAUTH_URL mismatch`
````bash
# Update NEXTAUTH_URL to match your Vercel URL
# Example: https://tcc-frontend.vercel.app
````

### Email Not Sending

**Error**: `Invalid login: 535-5.7.8`
````bash
# Solution: Verify Gmail app password
# 1. Check EMAIL_USER matches Gmail account
# 2. Check EMAIL_PASSWORD is app password (16 chars, no spaces)
# 3. Verify 2FA is enabled on Gmail
````

### Pages Show Old Content

**Solution**: Redis migration might not have run
````powershell
# Re-run migration
curl -X POST https://your-project.vercel.app/api/admin/migrate
````

---

## Monitoring & Maintenance

### Daily
- [ ] Check Vercel deployment logs for errors
- [ ] Monitor email delivery (check spam if not receiving)

### Weekly
- [ ] Backup Redis data (`npm run backup-redis`)
- [ ] Check Upstash Redis usage in console
- [ ] Review Vercel Analytics

### Monthly
- [ ] Update dependencies (`npm outdated`)
- [ ] Review and rotate secrets if needed
- [ ] Check for Next.js updates

---

## Cost Monitoring

### Current Setup (Free Tier)
```
Vercel Hobby: $0/month
  - 100GB bandwidth
  - Unlimited deployments

Upstash Redis: $0/month
  - 10,000 commands/day
  - 256MB storage

Total: $0/month
```

### Usage Limits to Watch
- **Vercel**: 100GB bandwidth/month
- **Upstash**: 10,000 commands/day
- **Gmail**: 500 emails/day

### When to Upgrade
- **Vercel Pro** ($20/month): When bandwidth exceeds 100GB
- **Upstash Paid** ($10-40/month): When commands exceed 10,000/day
- **Email Service** (Resend/SendGrid): When emails exceed 300/day

---

## Rollback Plan

### If Deployment Fails

**Option 1: Rollback in Vercel**
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click **"•••"** → **"Promote to Production"**

**Option 2: Revert Code**
````powershell
git revert HEAD
git push origin main
````

### If Redis Data is Lost

````powershell
# Restore from backup
npm run restore-redis backups/redis-backup-YYYY-MM-DD.json
````

---

## Success Criteria

✅ **Deployment is successful when**:
- [ ] Site loads at production URL
- [ ] All pages render correctly
- [ ] Authentication works (Google OAuth)
- [ ] Admin dashboard accessible
- [ ] CRUD operations work (create/edit/delete)
- [ ] Redis data is populated
- [ ] Email submissions work
- [ ] Images load correctly
- [ ] No console errors
- [ ] Performance is good (<3s load time)

---

## Next Steps After Deployment

1. **Set up monitoring**: Enable Vercel Analytics
2. **Add custom domain**: Configure DNS records
3. **Set up backups**: Schedule weekly Redis backups
4. **Enable HTTPS**: Vercel provides SSL automatically
5. **Add robots.txt**: For SEO optimization
6. **Configure sitemap**: For search engines
7. **Add error tracking**: Consider Sentry integration

---

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Upstash Docs**: [upstash.com/docs](https://upstash.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Issues**: [github.com/AmoghRisbud/TCC_frontend/issues](https://github.com/AmoghRisbud/TCC_frontend/issues)

---

**🎉 Congratulations! Your TCC Frontend is now live on Vercel with Upstash Redis!**

**Production URL**: https://your-project.vercel.app
