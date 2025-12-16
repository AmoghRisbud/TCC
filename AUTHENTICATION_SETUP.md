# Authentication Setup Guide

This guide explains how to set up and configure OAuth-based authentication for The Collective Counsel application using NextAuth.js.

## Overview

The application uses NextAuth.js with a JWT (JSON Web Token) strategy for authentication, which means **no database is required**. User sessions are stored in encrypted JWT tokens.

### Supported OAuth Providers

- **Google OAuth** - Sign in with Google account
- **GitHub OAuth** - Sign in with GitHub account

### Features

- ✅ No database required (JWT-based sessions)
- ✅ OAuth authentication (Google & GitHub)
- ✅ Role-based access control (Admin/User)
- ✅ Protected admin routes
- ✅ Responsive sign-in UI
- ✅ Session management
- ✅ Automatic session refresh

## Prerequisites

Before setting up authentication, you need to:

1. Have a Google Cloud account (for Google OAuth)
2. Have a GitHub account (for GitHub OAuth)
3. Have your application deployed or running locally

## Step 1: Generate NextAuth Secret

Generate a secure secret key for encrypting session tokens:

```bash
openssl rand -base64 32
```

Copy the output and save it for the next step.

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root (or update your existing one):

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-generated-secret-from-step-1
NEXTAUTH_URL=http://localhost:3000  # Update for production

# Google OAuth (See Step 3)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (See Step 4)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Admin Users (emails that should have admin access)
ADMIN_EMAIL_1=admin@example.com
ADMIN_EMAIL_2=another-admin@example.com
ADMIN_EMAIL_3=third-admin@example.com
```

## Step 3: Set Up Google OAuth

### 3.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

### 3.2 Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Configure:
   - **Name**: TCC Authentication
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**
7. Add them to your `.env.local` file as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## Step 4: Set Up GitHub OAuth

### 4.1 Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure:
   - **Application name**: The Collective Counsel
   - **Homepage URL**: 
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production)
   - **Authorization callback URL**:
     - `http://localhost:3000/api/auth/callback/github` (for development)
     - `https://your-domain.com/api/auth/callback/github` (for production)
4. Click "Register application"
5. Copy the **Client ID**
6. Click "Generate a new client secret" and copy it
7. Add them to your `.env.local` file as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

## Step 5: Configure Admin Users

Admin users are configured via environment variables. Users whose email addresses match the configured admin emails will have admin privileges.

In your `.env.local` file, you have two options:

**Option 1: Comma-separated list (recommended for many admins)**

```env
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com,admin4@example.com
```

**Option 2: Individual variables (backward compatible)**

```env
ADMIN_EMAIL_1=your-admin@example.com
ADMIN_EMAIL_2=another-admin@example.com
ADMIN_EMAIL_3=third-admin@example.com
```

**Note**: You can use both options together - all emails will be combined into the admin list.

## Step 6: Test Authentication

### 6.1 Start the Development Server

```bash
npm run dev
```

### 6.2 Test Sign In

1. Navigate to `http://localhost:3000`
2. Click "Sign In" in the navigation bar
3. Choose Google or GitHub
4. Complete the OAuth flow
5. You should be redirected back to the home page
6. Your profile should appear in the navigation bar

### 6.3 Test Admin Access

1. Sign in with an email address configured as admin
2. Navigate to `/admin`
3. You should see the admin dashboard
4. Try accessing admin routes (they should work)
5. Sign out and try accessing `/admin` again (you should be redirected to sign in)

### 6.4 Test Non-Admin Access

1. Sign in with an email address NOT configured as admin
2. Try to navigate to `/admin`
3. You should be redirected to an error page (Access Denied)

## How It Works

### Authentication Flow

1. User clicks "Sign In"
2. User is redirected to `/auth/signin`
3. User chooses OAuth provider (Google or GitHub)
4. User is redirected to provider's OAuth page
5. User authorizes the application
6. Provider redirects back to `/api/auth/callback/[provider]`
7. NextAuth creates a JWT token with user info
8. User is redirected to the original page or home
9. JWT token is stored in a secure HTTP-only cookie

### Admin Authorization

1. Middleware checks if route starts with `/admin` or `/api/admin`
2. If yes, middleware verifies:
   - User is authenticated (has valid JWT token)
   - User email is in the admin list
3. If both conditions pass, access is granted
4. Otherwise, user is redirected to sign-in or error page

### Session Management

- Sessions are stored as JWT tokens (no database needed)
- Tokens are encrypted using `NEXTAUTH_SECRET`
- Tokens expire after 30 days (configurable)
- Tokens are automatically refreshed on activity

## Protected Routes

The following routes are protected and require admin authentication:

- `/admin` - Admin dashboard
- `/admin/*` - All admin pages (programs, testimonials, gallery, research)
- `/api/admin/*` - All admin API endpoints

## User Interface

### Sign In Page

Located at `/auth/signin`, features:
- Clean, modern design
- Google and GitHub sign-in buttons
- Error handling
- Responsive layout

### Navigation Bar

Shows:
- "Sign In" button (when not authenticated)
- User profile with avatar and name (when authenticated)
- "Admin" badge (for admin users)
- "Sign Out" button (when authenticated)

## Production Deployment

### 1. Update Environment Variables

On your hosting platform (Vercel, Netlify, etc.):

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
ADMIN_EMAIL_1=your-admin@example.com
```

### 2. Update OAuth Callback URLs

Update your OAuth apps to include production URLs:

**Google:**
- Authorized JavaScript origins: `https://your-domain.com`
- Redirect URIs: `https://your-domain.com/api/auth/callback/google`

**GitHub:**
- Homepage URL: `https://your-domain.com`
- Callback URL: `https://your-domain.com/api/auth/callback/github`

### 3. Deploy

Deploy your application normally. Authentication should work immediately.

## Security Best Practices

### 1. Keep Secrets Secure

- ❌ Never commit `.env.local` to version control
- ✅ Use environment variables on hosting platform
- ✅ Generate strong `NEXTAUTH_SECRET` (32+ characters)
- ✅ Rotate secrets periodically

### 2. Use HTTPS in Production

- ✅ Always use HTTPS for production
- ✅ HTTP-only cookies are enabled by default
- ✅ Secure cookies are automatic with HTTPS

### 3. Limit Admin Access

- ✅ Only add trusted email addresses as admins
- ✅ Review admin list regularly
- ✅ Remove admin access when no longer needed

### 4. Monitor Authentication

- ✅ Check server logs for failed auth attempts
- ✅ Monitor for unusual sign-in patterns
- ✅ Set up alerts for OAuth errors

## Troubleshooting

### Issue: "Configuration error" on sign-in

**Cause**: Missing or invalid OAuth credentials

**Solution**: 
1. Verify `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET` are set
2. Check credentials are correct
3. Restart development server

### Issue: "Access Denied" when accessing admin

**Cause**: User email is not in admin list

**Solution**:
1. Add your email to `ADMIN_EMAIL_1`, `ADMIN_EMAIL_2`, or `ADMIN_EMAIL_3`
2. Restart development server
3. Sign out and sign in again

### Issue: Redirect to wrong URL after sign-in

**Cause**: Incorrect `NEXTAUTH_URL`

**Solution**:
1. Set `NEXTAUTH_URL=http://localhost:3000` for development
2. Set `NEXTAUTH_URL=https://your-domain.com` for production
3. Restart server

### Issue: OAuth callback error

**Cause**: Callback URL mismatch

**Solution**:
1. Verify callback URL in OAuth app matches:
   - Development: `http://localhost:3000/api/auth/callback/[provider]`
   - Production: `https://your-domain.com/api/auth/callback/[provider]`
2. Save changes in OAuth provider console
3. Wait a few minutes for changes to propagate

### Issue: Session not persisting

**Cause**: Missing or invalid `NEXTAUTH_SECRET`

**Solution**:
1. Generate new secret: `openssl rand -base64 32`
2. Set `NEXTAUTH_SECRET` in `.env.local`
3. Restart server

## Advanced Configuration

### Custom Session Duration

Edit `lib/auth.ts`:

```typescript
session: {
  strategy: 'jwt',
  maxAge: 7 * 24 * 60 * 60, // 7 days instead of 30
}
```

### Add More OAuth Providers

NextAuth supports many providers. To add more:

1. Install provider: `npm install next-auth`
2. Import provider in `lib/auth.ts`
3. Add to providers array
4. Configure OAuth app
5. Add credentials to `.env.local`

Example for Microsoft:

```typescript
import MicrosoftProvider from 'next-auth/providers/microsoft';

providers: [
  // ... existing providers
  MicrosoftProvider({
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
  }),
]
```

### Customize Admin Check

Edit `lib/auth.ts` to use a different method:

```typescript
// Option 1: Check email domain
token.isAdmin = user.email?.endsWith('@yourcompany.com') || false;

// Option 2: Use external API
const response = await fetch(`/api/check-admin?email=${user.email}`);
token.isAdmin = await response.json();

// Option 3: Use environment variable with multiple emails
const adminEmails = (process.env.ADMIN_EMAILS || '').split(',');
token.isAdmin = adminEmails.includes(user.email || '');
```

### Add Custom User Roles

Extend the JWT callback in `lib/auth.ts`:

```typescript
async jwt({ token, user }) {
  if (user) {
    token.role = determineUserRole(user.email);
  }
  return token;
}
```

Update types in `types/next-auth.d.ts`:

```typescript
interface Session {
  user: {
    role: 'admin' | 'moderator' | 'user';
  } & DefaultSession['user'];
}
```

## Support

For issues or questions:
1. Check this documentation first
2. Review [NextAuth.js documentation](https://next-auth.js.org/)
3. Check server logs for detailed errors
4. Contact support team

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [JWT.io](https://jwt.io/) - JWT debugger
