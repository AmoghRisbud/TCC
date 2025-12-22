# Pre-Deployment Checklist

## ✅ Code Ready for Production

### Configuration Files
- [x] `vercel.json` - Vercel deployment configuration
- [x] `next.config.mjs` - Updated for Vercel serverless
- [x] `.env.production.example` - Environment variables template
- [x] `lib/redis.ts` - Upstash Redis support with TLS
- [x] `middleware.ts` - Admin route protection

### Scripts
- [x] `scripts/backup-redis.js` - Redis data backup
- [x] `scripts/restore-redis.js` - Redis data restore
- [x] `scripts/test-email.js` - Email service validation

### Package Scripts
- [x] `npm run backup-redis` - Backup Redis data
- [x] `npm run restore-redis` - Restore Redis data
- [x] `npm run test-email` - Test email configuration

## 📋 Pre-Deployment Tasks

### Before Deploying
- [ ] Test locally: `npm run dev`
- [ ] Run type check: `npm run typecheck`
- [ ] Test build: `npm run build`
- [ ] Backup current Redis data: `npm run backup-redis`
- [ ] Commit all changes: `git add . && git commit -m "Production deployment"`
- [ ] Push to GitHub: `git push origin main`

### Accounts & Services
- [ ] Upstash account created
- [ ] Upstash Redis database created (us-east-1)
- [ ] Vercel account created
- [ ] Gmail app password generated
- [ ] Google OAuth credentials configured

### Environment Variables Ready
- [ ] `NEXTAUTH_URL` (production domain)
- [ ] `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `ADMIN_EMAILS`
- [ ] `REDIS_URL` (from Upstash)
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASSWORD`

## 🚀 Deployment Steps

### Step 1: Upstash Setup
- [ ] Create database: "tcc-production"
- [ ] Region: us-east-1
- [ ] Eviction policy: noeviction
- [ ] Copy REDIS_URL

### Step 2: Vercel Deployment
- [ ] Import GitHub repository
- [ ] Add environment variables
- [ ] Deploy

### Step 3: Update OAuth
- [ ] Add Vercel callback URLs to Google Console
- [ ] Test Google sign-in

### Step 4: Migrate Content
- [ ] Run migration API: `POST /api/admin/migrate`
- [ ] Verify data in Upstash console

### Step 5: Verification
- [ ] Test all public pages
- [ ] Test authentication flow
- [ ] Test admin dashboard
- [ ] Test CRUD operations
- [ ] Submit test CV application
- [ ] Verify email received

## 🔍 Post-Deployment Checks

### Functionality
- [ ] Home page loads
- [ ] Programs page shows data
- [ ] Research page shows articles
- [ ] Careers page shows jobs
- [ ] Admin login works
- [ ] Admin can create/edit/delete
- [ ] Email submissions work
- [ ] Images display correctly

### Performance
- [ ] Page load time < 3 seconds
- [ ] No 404 errors in console
- [ ] No JavaScript errors
- [ ] Images load correctly
- [ ] Mobile responsive

### Security
- [ ] Admin routes protected
- [ ] Environment variables not exposed
- [ ] OAuth callbacks configured
- [ ] HTTPS enabled (automatic on Vercel)

## 📊 Monitoring Setup

### Immediate
- [ ] Check Vercel deployment logs
- [ ] Check Function logs for errors
- [ ] Enable Vercel Analytics

### Weekly
- [ ] Backup Redis data
- [ ] Check Upstash usage
- [ ] Review error logs

## 🎯 Success Criteria

✅ **Ready to go live when:**
- All checkboxes above are checked
- No errors in Vercel logs
- Test CV submission received via email
- Admin dashboard fully functional
- Redis data verified in Upstash

## 📞 Emergency Contacts

**If something goes wrong:**
1. Check Vercel deployment logs
2. Check Upstash Redis console
3. Roll back deployment in Vercel
4. Restore Redis backup if needed
5. Check DEPLOYMENT_GUIDE.md troubleshooting section

---

**Last Updated**: Pre-deployment configuration complete
**Next Action**: Follow DEPLOYMENT_GUIDE.md step-by-step
