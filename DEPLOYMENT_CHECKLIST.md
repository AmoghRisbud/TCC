# Deployment Checklist for TCC Frontend

## Pre-Deployment Verification

### 1. Build & Tests
- [x] ✅ Application builds successfully (`npm run build`)
- [x] ✅ TypeScript compilation passes (`npm run typecheck`)
- [ ] ⏳ Manual testing (requires OAuth credentials)
- [ ] ⏳ End-to-end authentication flow testing

### 2. Environment Variables Setup

#### Required for Production:
- [ ] `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - Set to: `https://your-domain.com`
- [ ] `REDIS_URL` - Your Redis connection string (if using Redis)

#### OAuth Providers:
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GITHUB_CLIENT_ID` - From GitHub OAuth Apps
- [ ] `GITHUB_CLIENT_SECRET` - From GitHub OAuth Apps

#### Admin Configuration:
- [ ] `ADMIN_EMAILS` or `ADMIN_EMAIL_1`, `ADMIN_EMAIL_2`, `ADMIN_EMAIL_3`

### 3. OAuth Provider Configuration

#### Google OAuth Setup:
- [ ] Create OAuth credentials in Google Cloud Console
- [ ] Add authorized JavaScript origins:
  - [ ] Production domain: `https://your-domain.com`
- [ ] Add authorized redirect URIs:
  - [ ] Production: `https://your-domain.com/api/auth/callback/google`
- [ ] Enable Google+ API

#### GitHub OAuth Setup:
- [ ] Create OAuth App in GitHub Developer Settings
- [ ] Set homepage URL: `https://your-domain.com`
- [ ] Set authorization callback URL: `https://your-domain.com/api/auth/callback/github`
- [ ] Generate and save client secret

### 4. Redis Configuration (Optional)
- [ ] Redis service is running and accessible
- [ ] `REDIS_URL` environment variable is set
- [ ] Migration completed: `POST /api/admin/migrate`
- [ ] Verify content loads from Redis

### 5. Security Checklist
- [ ] HTTPS is enabled on production domain
- [ ] `NEXTAUTH_SECRET` is strong and unique (32+ characters)
- [ ] OAuth secrets are kept secure (not in version control)
- [ ] Admin email list is configured correctly
- [ ] CORS policies are configured if needed
- [ ] Rate limiting is considered for auth endpoints

### 6. Documentation Review
- [x] ✅ `AUTHENTICATION_SETUP.md` - Setup guide complete
- [x] ✅ `README.md` - Updated with auth info
- [x] ✅ `.env.example` - All variables documented
- [x] ✅ `IMPLEMENTATION_NOTES.md` - Technical details documented

### 7. Feature Verification

#### Public Features (No Auth Required):
- [ ] Home page loads correctly
- [ ] Programs page displays all programs
- [ ] Research page displays articles
- [ ] Testimonials page works
- [ ] Gallery/Media page works
- [ ] Navigation works on all pages

#### Authentication Features:
- [ ] Sign-in page loads at `/auth/signin`
- [ ] Google sign-in redirects correctly
- [ ] GitHub sign-in redirects correctly
- [ ] User profile shows in navbar after sign-in
- [ ] Sign-out functionality works
- [ ] Session persists across page reloads

#### Admin Features (Requires Admin Role):
- [ ] `/admin` dashboard accessible to admins only
- [ ] `/admin/programs` - CRUD operations work
- [ ] `/admin/testimonials` - CRUD operations work
- [ ] `/admin/gallery` - CRUD operations work
- [ ] `/admin/research` - CRUD operations work
- [ ] Non-admin users redirected to error page
- [ ] Unauthenticated users redirected to sign-in

#### API Endpoints:
- [ ] `/api/auth/[...nextauth]` - NextAuth endpoints work
- [ ] `/api/admin/programs` - Protected, admin-only
- [ ] `/api/admin/testimonials` - Protected, admin-only
- [ ] `/api/admin/gallery` - Protected, admin-only
- [ ] `/api/admin/research` - Protected, admin-only

### 8. Monitoring Setup
- [ ] Error logging configured
- [ ] Authentication failure alerts set up
- [ ] Monitor session creation/destruction
- [ ] Track admin route access
- [ ] Redis connection monitoring (if used)

### 9. Backup & Recovery
- [ ] Environment variables backed up securely
- [ ] Redis data backup strategy in place (if used)
- [ ] OAuth credentials stored securely (e.g., password manager)
- [ ] Rollback plan documented

### 10. Performance Checks
- [ ] Page load times acceptable
- [ ] Authentication flow is fast
- [ ] Admin pages load quickly
- [ ] API response times acceptable
- [ ] Consider CDN for static assets

## Post-Deployment Verification

### Immediate (Within 1 hour):
- [ ] Test sign-in with each OAuth provider
- [ ] Verify admin access works
- [ ] Check error page displays correctly
- [ ] Verify sign-out works
- [ ] Test mobile responsiveness

### Short-term (Within 24 hours):
- [ ] Monitor error logs for auth failures
- [ ] Check session persistence over time
- [ ] Verify HTTPS certificates valid
- [ ] Test admin CRUD operations
- [ ] Verify Redis fallback works (if applicable)

### Long-term (Within 1 week):
- [ ] Monitor authentication success rates
- [ ] Check for OAuth token expiration issues
- [ ] Review admin activity logs
- [ ] Gather user feedback on auth experience
- [ ] Performance metrics look good

## Troubleshooting Reference

### Common Issues & Solutions

#### "Configuration Error" on Sign-in
- Check OAuth credentials are correct
- Verify callback URLs match exactly
- Restart application after env var changes

#### "Access Denied" for Admin
- Verify email is in admin list
- Check environment variables loaded
- Sign out and sign in again

#### Session Not Persisting
- Check `NEXTAUTH_SECRET` is set
- Verify HTTPS is enabled in production
- Check cookie settings in browser

#### OAuth Callback Fails
- Verify callback URL exactly matches OAuth app config
- Check for typos in domain name
- Ensure HTTPS in production

#### Redis Connection Failed
- Check `REDIS_URL` is correct
- Verify Redis service is running
- Test connection manually
- Fallback to markdown should work automatically

## Support Contacts

- **Technical Lead**: [Contact Info]
- **DevOps**: [Contact Info]
- **Documentation**: `AUTHENTICATION_SETUP.md`, `README.md`
- **Code Review**: `IMPLEMENTATION_NOTES.md`

## Sign-off

- [ ] Developer Sign-off: Code complete and tested
- [ ] Security Review: Security checklist passed
- [ ] Documentation: All docs complete and accurate
- [ ] QA Sign-off: Testing complete
- [ ] Deployment Approval: Ready for production

---

**Last Updated**: December 16, 2025
**Version**: 1.0.0
**Prepared by**: GitHub Copilot Agent
