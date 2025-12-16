# Admin Content Management System Setup

This document explains how to set up and use the Redis-based admin content management system for programs, testimonials, gallery, and research articles.

## Prerequisites

1. **Redis Server**: You need a Redis server running. You can:
   - Install Redis locally: [Redis Installation Guide](https://redis.io/docs/getting-started/)
   - Use a cloud Redis service (e.g., Redis Cloud, AWS ElastiCache, Azure Cache for Redis)
   - Use Docker: `docker run -d -p 6379:6379 redis`

## Setup Instructions

### 1. Install Dependencies

Dependencies are already included in `package.json`. If you need to reinstall:

```bash
npm install
```

### 2. Configure Redis Connection

Create a `.env.local` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Redis connection URL:

```env
REDIS_URL=redis://localhost:6379
```

For production or cloud Redis, use your provider's connection string.

### 3. Migrate Existing Content to Redis

Before you can use the admin interface, you need to migrate the existing markdown content to Redis:

**Option A: Using the API endpoint (recommended)**

Start the development server:

```bash
npm run dev
```

Then make a POST request to the migration endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/migrate
```

Or visit `http://localhost:3000/api/admin/migrate` in your browser and use a REST client extension to send a POST request.

**Option B: Manually load data**

You can also use the API endpoints directly to create content.

### 4. Verify Migration

Check the migration response for success and the number of items migrated:

```json
{
  "success": true,
  "migrated": {
    "programs": 1,
    "research": 7,
    "testimonials": 2,
    "gallery": 3
  },
  "message": "Content successfully migrated from markdown files to Redis"
}
```

## Using the Admin System

### API Endpoints

All admin endpoints are located under `/api/admin/`:

#### Programs
- `GET /api/admin/programs` - Get all programs
- `POST /api/admin/programs` - Create/update all programs (bulk)
- `PUT /api/admin/programs` - Update a single program
- `DELETE /api/admin/programs?slug=program-slug` - Delete a program

#### Testimonials
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Create/update all testimonials (bulk)
- `PUT /api/admin/testimonials` - Update a single testimonial
- `DELETE /api/admin/testimonials?id=testimonial-id` - Delete a testimonial

#### Gallery
- `GET /api/admin/gallery` - Get all gallery items
- `POST /api/admin/gallery` - Create/update all gallery items (bulk)
- `PUT /api/admin/gallery` - Update a single gallery item
- `DELETE /api/admin/gallery?id=item-id` - Delete a gallery item

#### Research
- `GET /api/admin/research` - Get all research articles
- `POST /api/admin/research` - Create/update all research articles (bulk)
- `PUT /api/admin/research` - Update a single research article
- `DELETE /api/admin/research?slug=research-slug` - Delete a research article

### Example API Usage

#### Get all programs
```bash
curl http://localhost:3000/api/admin/programs
```

#### Update a program
```bash
curl -X PUT http://localhost:3000/api/admin/programs \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "arbitration-law",
    "title": "Arbitration Law",
    "shortDescription": "Updated description",
    "category": "Engagement"
  }'
```

#### Delete a testimonial
```bash
curl -X DELETE "http://localhost:3000/api/admin/testimonials?id=test1"
```

## How It Works

1. **Data Storage**: Content is stored in Redis as JSON strings with keys:
   - `tcc:programs` - All programs
   - `tcc:testimonials` - All testimonials
   - `tcc:gallery` - All gallery items
   - `tcc:research` - All research articles

2. **Fallback Mechanism**: If Redis is not available or data doesn't exist in Redis, the system automatically falls back to reading from markdown files in the `content/` directory.

3. **No Code Updates Required**: Once migrated, the system works seamlessly. The website will fetch data from Redis. If Redis is down, it will use markdown files as backup.

## Admin Pages

The following admin pages are available:

- `/admin` - Admin dashboard
- `/admin/programs` - Manage programs
- `/admin/testimonials` - Manage testimonials

These pages currently display the content. To enable full editing functionality, you can:

1. Build a custom admin UI using the API endpoints
2. Use a REST client (Postman, Insomnia, curl) to manage content via the API
3. Create admin forms that interact with the API endpoints

## Troubleshooting

### Redis Connection Issues

If you see "Redis connection failed" errors:

1. Verify Redis is running: `redis-cli ping` (should return "PONG")
2. Check the REDIS_URL in your `.env.local` file
3. Ensure no firewall is blocking the Redis port
4. Check Redis logs for errors

### Content Not Showing

1. Verify migration completed successfully
2. Check Redis data: `redis-cli` then `GET tcc:programs`
3. Check server logs for errors
4. Verify Redis connection URL is correct

### Fallback to Markdown

If Redis is unavailable, the system will automatically use markdown files. This is expected behavior and ensures the site remains functional even if Redis is down.

## Production Deployment

For production:

1. Use a managed Redis service (Redis Cloud, AWS ElastiCache, etc.)
2. Set the `REDIS_URL` environment variable with your production Redis connection string
3. Ensure the Redis service is accessible from your production environment
4. Run the migration script after deploying to production
5. Set up Redis persistence and backups

## Security Considerations

- Add authentication/authorization before deploying the admin API endpoints to production
- Protect the `/api/admin/*` routes with middleware
- Use HTTPS in production
- Keep your Redis connection string secure (use environment variables)
- Consider implementing rate limiting on API endpoints

## Future Enhancements

- Add a complete admin UI with forms for editing content
- Implement user authentication and role-based access control
- Add image upload functionality for programs, testimonials, and gallery
- Implement content versioning
- Add audit logging for content changes
