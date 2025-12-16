# Usage Guide: Admin Content Management

This guide explains how to use the Redis-based admin content management system.

## How It Works

The system provides a seamless content management experience:

1. **Without Redis**: The site works normally using markdown files from the `content/` directory
2. **With Redis**: The site uses content stored in Redis, which can be edited via API calls without code changes

## Quick Start (Without Redis)

The site works out of the box without Redis:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site with content from markdown files.

## Using Redis for Dynamic Content Management

### Step 1: Start Redis

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 6379:6379 --name tcc-redis redis
```

**Option B: Local Installation**
Install Redis from https://redis.io/docs/getting-started/

### Step 2: Configure Environment

Create `.env.local`:
```env
REDIS_URL=redis://localhost:6379
```

### Step 3: Migrate Existing Content

Start the development server:
```bash
npm run dev
```

Migrate content to Redis:
```bash
curl -X POST http://localhost:3000/api/admin/migrate
```

### Step 4: Verify Migration

Check that data is in Redis:
```bash
redis-cli
> GET tcc:programs
> GET tcc:testimonials
> GET tcc:gallery
> GET tcc:research
```

## Managing Content via API

### View All Programs

```bash
curl http://localhost:3000/api/admin/programs
```

### Add a New Program

```bash
curl -X PUT http://localhost:3000/api/admin/programs \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "new-program",
    "title": "New Program",
    "shortDescription": "A brand new program",
    "category": "Learning",
    "featured": true,
    "status": "upcoming"
  }'
```

### Update a Testimonial

```bash
curl -X PUT http://localhost:3000/api/admin/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test1",
    "name": "Updated Name",
    "role": "Updated Role",
    "quote": "Updated quote text",
    "featured": true
  }'
```

### Add a Gallery Item

```bash
curl -X PUT http://localhost:3000/api/admin/gallery \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-event",
    "title": "New Event",
    "description": "Event description",
    "image": "/images/media/new-event.png",
    "altText": "New Event",
    "album": "events",
    "date": "2025-02-01"
  }'
```

### Add a Research Article

```bash
curl -X PUT http://localhost:3000/api/admin/research \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "new-research",
    "title": "New Research Article",
    "summary": "Summary of the research",
    "year": "2025",
    "pdf": "/research/new-article.pdf"
  }'
```

### Delete Content

```bash
# Delete a program
curl -X DELETE "http://localhost:3000/api/admin/programs?slug=new-program"

# Delete a testimonial
curl -X DELETE "http://localhost:3000/api/admin/testimonials?id=test1"

# Delete a gallery item
curl -X DELETE "http://localhost:3000/api/admin/gallery?id=new-event"

# Delete a research article
curl -X DELETE "http://localhost:3000/api/admin/research?slug=new-research"
```

## Viewing Changes

After making changes via the API:

1. Refresh any page on your site
2. Changes appear immediately (no rebuild needed)
3. Content persists in Redis across server restarts

## Building a Custom Admin UI

You can build a custom admin interface that uses these APIs:

### Example: React Admin Form

```tsx
'use client';
import { useState } from 'react';

export default function ProgramEditor() {
  const [program, setProgram] = useState({
    slug: '',
    title: '',
    shortDescription: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/admin/programs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });
    const result = await response.json();
    alert('Program saved!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={program.title}
        onChange={(e) => setProgram({...program, title: e.target.value})}
        placeholder="Program Title"
      />
      {/* Add more fields */}
      <button type="submit">Save Program</button>
    </form>
  );
}
```

## Testing the System

### Test 1: Check Fallback Mechanism

Stop Redis and verify the site still works with markdown files:
```bash
docker stop tcc-redis
npm run dev
# Site should work normally
```

### Test 2: Check Redis Content

Start Redis and migrate:
```bash
docker start tcc-redis
curl -X POST http://localhost:3000/api/admin/migrate
# Site should now use Redis content
```

### Test 3: Add New Content

Add a new program via API:
```bash
curl -X PUT http://localhost:3000/api/admin/programs \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-program",
    "title": "Test Program",
    "shortDescription": "This is a test",
    "featured": true
  }'
```

Visit `/programs` to see the new program appear.

## Production Deployment

For production:

1. Use a managed Redis service (Redis Cloud, AWS ElastiCache, etc.)
2. Set `REDIS_URL` environment variable in your hosting platform
3. Deploy your Next.js app
4. Run the migration endpoint once after deployment
5. Content is now manageable via API without redeployment

### Example: Vercel Deployment

```bash
# Add Redis URL to Vercel
vercel env add REDIS_URL

# Deploy
vercel deploy
```

## Best Practices

1. **Always backup Redis data** - Use Redis persistence (RDB/AOF)
2. **Implement authentication** - Protect `/api/admin/*` routes in production
3. **Use HTTPS** - Encrypt data in transit
4. **Version control** - Keep markdown files as backup even when using Redis
5. **Monitoring** - Set up alerts for Redis connection issues

## Troubleshooting

### Content Not Updating

1. Check Redis is running: `redis-cli ping`
2. Verify data in Redis: `redis-cli GET tcc:programs`
3. Check browser cache (hard refresh: Ctrl+Shift+R)

### Redis Connection Failed

The site will automatically fall back to markdown files. To fix:

1. Verify `REDIS_URL` in `.env.local`
2. Ensure Redis is accessible
3. Check firewall settings
4. Review server logs for detailed error messages

## API Reference

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for complete API documentation.

## Support

For issues or questions:
1. Check the [ADMIN_SETUP.md](./ADMIN_SETUP.md) documentation
2. Review error logs in the console
3. Ensure Redis connection is properly configured
