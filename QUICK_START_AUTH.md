# Quick Start: Authentication Setup

This is a condensed guide to get authentication working quickly. For comprehensive details, see `AUTHENTICATION_SETUP.md`.

## Prerequisites

✅ Node.js and npm installed
✅ Application running (`npm run dev`)
✅ Google account (for Google OAuth)
✅ GitHub account (for GitHub OAuth)

## 5-Minute Setup

### Step 1: Generate Secret (30 seconds)

```bash
openssl rand -base64 32
```

Copy the output - you'll need it next.

### Step 2: Create `.env.local` (2 minutes)

Create a file named `.env.local` in the project root:

```env
# NextAuth
NEXTAUTH_SECRET=paste-the-secret-from-step-1-here
NEXTAUTH_URL=http://localhost:3000

# We'll fill these in steps 3 & 4
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Admin email (use your own email)
ADMIN_EMAILS=your-email@gmail.com
```

### Step 3: Setup Google OAuth (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Application type: "Web application"
6. Authorized JavaScript origins: `http://localhost:3000`
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Click "Create"
9. Copy **Client ID** and **Client Secret**
10. Paste them into `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### Step 4: Setup GitHub OAuth (1 minute)

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Application name: "TCC Local Dev"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Click "Register application"
7. Copy **Client ID**
8. Click "Generate a new client secret" and copy it
9. Paste them into `.env.local` as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### Step 5: Restart & Test (30 seconds)

```bash
# Stop the dev server (Ctrl+C)
npm run dev

# Visit in browser
http://localhost:3000/auth/signin
```

Click "Continue with Google" or "Continue with GitHub" and sign in!

## Verify It Works

✅ After signing in, you should see your profile in the navbar
✅ Visit `http://localhost:3000/admin` - you should have access (if your email is in ADMIN_EMAILS)
✅ Try signing out and signing back in

## Troubleshooting

### "Configuration error"
- Check all environment variables are set in `.env.local`
- Restart the dev server

### "Access Denied" when accessing /admin
- Make sure your email is in `ADMIN_EMAILS` in `.env.local`
- Sign out and sign in again

### OAuth callback fails
- Check redirect URIs match exactly in OAuth app settings
- Verify NEXTAUTH_URL matches your current domain

## Next Steps

- 📖 Read `AUTHENTICATION_SETUP.md` for production setup
- 🚀 Read `DEPLOYMENT_CHECKLIST.md` before deploying
- 📊 Read `AUTHENTICATION_SUMMARY.md` for technical details

## Production Setup

For production deployment:

1. Update OAuth apps with production URLs:
   - Google: `https://your-domain.com` and `https://your-domain.com/api/auth/callback/google`
   - GitHub: `https://your-domain.com` and `https://your-domain.com/api/auth/callback/github`

2. Update environment variables on hosting platform:
   ```env
   NEXTAUTH_SECRET=<new-strong-secret>
   NEXTAUTH_URL=https://your-domain.com
   GOOGLE_CLIENT_ID=<from-google>
   GOOGLE_CLIENT_SECRET=<from-google>
   GITHUB_CLIENT_ID=<from-github>
   GITHUB_CLIENT_SECRET=<from-github>
   ADMIN_EMAILS=admin@yourdomain.com
   ```

3. Deploy and test!

## Support

- **Setup Issues**: See `AUTHENTICATION_SETUP.md` Section 9 (Troubleshooting)
- **Security Questions**: See `AUTHENTICATION_SETUP.md` Section 8 (Security Best Practices)
- **Technical Details**: See `IMPLEMENTATION_NOTES.md`

---

**Total Time**: ~5 minutes
**Difficulty**: Easy
**Requirements**: Google & GitHub accounts
