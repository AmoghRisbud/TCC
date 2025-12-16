# The Collective Counsel (TCC) Website

Static Next.js (App Router) + Tailwind + Redis-based Admin Content Management.

## Stack
- Next.js 14 (App Router, SSG)
- Tailwind CSS
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

## Admin Content Management

The site now supports dynamic content management through Redis-backed APIs:

### Features
- **Programs, Testimonials, Gallery, Research** - Edit via REST API
- **No code changes required** - Content updates without redeployment
- **Automatic fallback** - Works with markdown files when Redis is unavailable
- **Migration tool** - One-click migration from markdown to Redis

### Quick Setup
1. Start Redis: `docker run -d -p 6379:6379 redis`
2. Configure: Create `.env.local` with `REDIS_URL=redis://localhost:6379`
3. Migrate content: `curl -X POST http://localhost:3000/api/admin/migrate`

### API Endpoints
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
