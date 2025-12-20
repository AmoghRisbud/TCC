# TCC Frontend - AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js 14 App Router** application with a hybrid content management system using **Redis** (dynamic) and **Markdown** (fallback). Authentication is JWT-based via NextAuth.js with OAuth providers (no database required).

### Key Data Flow Pattern
```
Markdown files (content/*) → Redis (via migration) → API endpoints → Frontend pages
                                  ↓ (automatic fallback)
                            Markdown files (sync functions)
```

- **Redis-managed content**: Programs, Research, Testimonials, Gallery, Careers (async functions with fallback)
- **Markdown-only content**: Team members, Site settings (sync functions)
- All Redis content automatically falls back to markdown files if Redis is unavailable

## Content Management System

### Critical Pattern: Dual-Mode Content Loading
Located in [lib/content.ts](lib/content.ts):

```typescript
// Redis-backed content (with markdown fallback)
export const getPrograms = async (): Promise<Program[]> => {
  return getFromRedisOrMarkdown('tcc:programs', 'programs', (d, slug) => ({ slug, ...d }));
};

// Markdown-only content
export const getTeam = (): TeamMember[] => readMarkdownDir('team', (d, slug) => ({ slug, ...d }));
```

**Key Differences**:
- Redis-managed functions are `async` and use `getFromRedisOrMarkdown` helper
- Markdown-only functions are `sync` and use `readMarkdownDir` directly
- Never convert markdown-only content to async without adding Redis support

### Admin API Pattern
All admin APIs follow this structure ([app/api/admin/*/route.ts](app/api/admin)):

1. **GET**: Fetch all items or single item via `?slug=X` query param
2. **POST**: Create new item (checks for duplicate slugs) or bulk replace (if array provided)
3. **PUT**: Update existing item by slug
4. **DELETE**: Remove item by slug via query param

Example: `DELETE /api/admin/programs?slug=arbitration-law`

**Authentication**: All `/admin/*` and `/api/admin/*` routes are protected by [middleware.ts](middleware.ts) - requires authenticated admin user (JWT token with `isAdmin: true`).

## Authentication Architecture

**JWT-based, no database required** - configured in [lib/auth.ts](lib/auth.ts):

- Admin users defined via env vars: `ADMIN_EMAILS` (comma-separated) or `ADMIN_EMAIL_1`, `ADMIN_EMAIL_2`, etc.
- JWT tokens include custom `isAdmin` field checked by middleware
- OAuth providers: Google (extensible to GitHub/others)
- Session stored in JWT cookies (30-day expiry)

**Middleware pattern** ([middleware.ts](middleware.ts)): Two-stage check:
1. `authorized` callback: Basic token presence check
2. `middleware` function: Detailed role validation and redirects

## TypeScript Type System

All content types are in [lib/types.ts](lib/types.ts). Key interfaces:

- `Program`: Educational programs with sessions, CTA, metadata
- `Research`: Articles with PDF links, Drive links, author info
- `Testimonial`: User feedback with ratings, program references
- `GalleryItem`: Media items with albums, tags
- `Job`: Career postings with requirements, responsibilities

**NextAuth types extended** in [types/next-auth.d.ts](types/next-auth.d.ts) to include `isAdmin` and `provider` fields.

## Static Site Generation

**SSG with ISR pattern** - all dynamic routes use `generateStaticParams`:

```typescript
// Pattern: app/[resource]/[slug]/page.tsx
export async function generateStaticParams() {
  const items = await getPrograms(); // or getResearch(), etc.
  return items.map(item => ({ slug: item.slug }));
}
```

**Important**: Changes to Redis content require redeployment for static pages to update (or configure ISR with `revalidate`).

## Admin UI Components

Pattern for admin managers ([app/admin/*/Admin*Manager.tsx](app/admin)):

1. **Client component** with `'use client'` directive
2. **CRUD operations** via fetch to corresponding API routes
3. **Modal-based editing** with form state management
4. **Optimistic UI** with loading/error/success states
5. **Delete confirmation** before destructive operations

Example state pattern:
```typescript
const [items, setItems] = React.useState<Type[]>([]);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);
const [isModalOpen, setIsModalOpen] = React.useState(false);
const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
```

## Development Workflows

### Initial Setup
```powershell
npm install
# Configure .env.local (see ADMIN_SETUP.md)
npm run dev
```

### Redis Migration (One-time)
After starting Redis, migrate markdown to Redis:
```powershell
# Start Redis
docker run -d -p 6379:6379 redis

# Migrate content
curl -X POST http://localhost:3000/api/admin/migrate
# Or visit /admin and use the UI migration button
```

### Build & Deploy
```powershell
npm run build      # Creates standalone build
npm start          # Production server
npm run typecheck  # Check TypeScript errors
```

**Docker**: [Dockerfile](Dockerfile) uses multi-stage build with standalone output ([next.config.mjs](next.config.mjs) sets `output: 'standalone'`).

## Configuration Files

- **[middleware.ts](middleware.ts)**: Route protection for admin areas
- **[lib/auth.ts](lib/auth.ts)**: NextAuth configuration with admin role logic
- **[lib/redis.ts](lib/redis.ts)**: Redis client singleton with lazy connection
- **[next.config.mjs](next.config.mjs)**: Standalone output + Google OAuth image domains
- **[tailwind.config.js](tailwind.config.js)**: Custom brand colors (use `bg-brand-*`, `text-brand-*`)

## Common Patterns

### Adding New Content Type
1. Add interface to [lib/types.ts](lib/types.ts)
2. Add getter function to [lib/content.ts](lib/content.ts) (decide: Redis-backed or markdown-only)
3. Create API route in [app/api/admin/newtype/route.ts](app/api/admin) (if Redis-backed)
4. Create admin manager in [app/admin/newtype/AdminNewTypeManager.tsx](app/admin)
5. Add migration logic to [app/api/admin/migrate/route.ts](app/api/admin/migrate/route.ts)

### Updating Admin Logic
- Admin emails: Update `ADMIN_EMAILS` in `.env.local`
- Admin checks happen in JWT callback in [lib/auth.ts](lib/auth.ts)
- Middleware validates on every admin route access

### Redis Keys Convention
All keys prefixed with `tcc:` namespace:
- `tcc:programs`
- `tcc:research`
- `tcc:testimonials`
- `tcc:gallery`
- `tcc:careers`

## Environment Variables

Required in `.env.local`:
```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>

# Admin Access
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Redis
REDIS_URL=redis://localhost:6379
```

## Known Limitations

- Static pages don't auto-update when Redis content changes (requires rebuild/revalidation)
- No Redis = read-only mode (content served from markdown files)
- Single admin role (no granular permissions)
- No audit logging for admin changes
- Image uploads not implemented (use external hosting + URLs in content)
