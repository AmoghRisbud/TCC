# The Collective Counsel (TCC) Website

Static Next.js (App Router) + Tailwind + Redis-based Admin Content Management + OAuth Authentication.

## Stack
- Next.js 14 (App Router, SSG)
- Tailwind CSS
- NextAuth.js (OAuth Authentication)
- Redis for dynamic content management (optional)
- Markdown content in `content/**` (fallback)

## Getting Started (Windows PowerShell)
```powershell
npm install
npm run dev
```
Open: http://localhost:3000

## Build
```powershell
npm run build
npm start
```

## Content Structure
- `content/programs` Markdown with frontmatter
- `content/projects`
- `content/testimonials`
- `content/team`
- `content/jobs`
- `content/gallery`
- `content/settings/site.md`

## Authentication

The site uses OAuth-based authentication with no database required (JWT-based sessions):

### Features
- **OAuth Providers** - Sign in with Google or GitHub
- **No Database Required** - JWT-based sessions
- **Role-Based Access** - Admin and regular user roles
- **Protected Routes** - Automatic protection for admin pages

### Quick Setup
1. Generate secret: `openssl rand -base64 32`
2. Configure `.env.local` with OAuth credentials (see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md))
3. Set admin emails in environment variables
4. Users can sign in at `/auth/signin`

📖 **Full Documentation**: See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)

## Admin Content Management

The site supports dynamic content management through Redis-backed APIs with authentication:

### Features
- **Programs, Testimonials, Gallery, Research** - Edit via REST API or UI
- **Protected Admin Routes** - Requires authentication and admin role
- **No code changes required** - Content updates without redeployment
- **Automatic fallback** - Works with markdown files when Redis is unavailable
- **Migration tool** - One-click migration from markdown to Redis

### Quick Setup
1. Start Redis: `docker run -d -p 6379:6379 redis`
2. Configure: Create `.env.local` with `REDIS_URL=redis://localhost:6379`
3. Migrate content: `curl -X POST http://localhost:3000/api/admin/migrate`

### Admin Pages (Requires Authentication)
- `/admin` - Admin dashboard
- `/admin/programs` - Manage programs with UI
- `/admin/testimonials` - Manage testimonials with UI
- `/admin/gallery` - Manage gallery items with UI
- `/admin/research` - Manage research articles with UI

### API Endpoints (Requires Admin Role)
- `GET/PUT/DELETE /api/admin/programs` - Manage programs
- `GET/PUT/DELETE /api/admin/testimonials` - Manage testimonials
- `GET/PUT/DELETE /api/admin/gallery` - Manage gallery items
- `GET/PUT/DELETE /api/admin/research` - Manage research articles

📖 **Full Documentation**: See [ADMIN_SETUP.md](./ADMIN_SETUP.md) and [USAGE_GUIDE.md](./USAGE_GUIDE.md)

## Architecture

### Content Management Flow
1. **Default Mode**: Content loaded from markdown files in `content/`
2. **Redis Mode**: Content fetched from Redis with automatic fallback to markdown
3. **Admin API**: RESTful endpoints for CRUD operations on content

### Data Flow
```
markdown files → Redis (migration) → API endpoints → Frontend pages
                    ↓ (fallback)
                markdown files
```

## SEO Roadmap (Upcoming)
- Dynamic meta per page
- JSON-LD for Programs (Course), Jobs (JobPosting), Organization
- Sitemap & robots.txt generation script

## License
Internal project. No license header added.
