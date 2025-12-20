# Test Announcements Implementation

## Manual Testing Steps

### 1. Start Redis & Development Server
```powershell
# Terminal 1: Start Redis
docker run -d -p 6379:6379 redis

# Terminal 2: Start Next.js dev server
npm run dev
```

### 2. Run Migration (First Time)
Visit: http://localhost:3000/admin and click "Migrate Content to Redis"

Or use curl:
```powershell
curl -X POST http://localhost:3000/api/admin/migrate
```

### 3. Test Admin Interface
1. Sign in as admin user
2. Visit: http://localhost:3000/admin/announcements
3. Test operations:
   - ✅ View existing announcements
   - ✅ Add new announcement
   - ✅ Edit existing announcement
   - ✅ Delete announcement

### 4. Test Public Page
Visit: http://localhost:3000/announcements
- ✅ View all announcements sorted by date
- ✅ Click image to view in modal
- ✅ See loading state on first load

### 5. Test API Endpoints

#### Public API (No auth required)
```powershell
# Get all announcements
curl http://localhost:3000/api/announcements
```

#### Admin API (Requires authentication)
```powershell
# Get all announcements
curl http://localhost:3000/api/admin/announcements

# Get single announcement
curl http://localhost:3000/api/admin/announcements?slug=campus-ambassador

# Create new announcement
curl -X POST http://localhost:3000/api/admin/announcements `
  -H "Content-Type: application/json" `
  -d '{
    "slug": "new-workshop",
    "title": "Legal Writing Workshop",
    "description": "Join us for an intensive legal writing workshop.",
    "image": "/images/announcements/sample.jpeg",
    "date": "2025-02-01"
  }'

# Update announcement
curl -X PUT http://localhost:3000/api/admin/announcements `
  -H "Content-Type: application/json" `
  -d '{
    "slug": "new-workshop",
    "title": "Advanced Legal Writing Workshop",
    "description": "Join us for an advanced intensive legal writing workshop.",
    "image": "/images/announcements/sample.jpeg",
    "date": "2025-02-01"
  }'

# Delete announcement
curl -X DELETE "http://localhost:3000/api/admin/announcements?slug=new-workshop"
```

### 6. Test Redis Fallback
1. Stop Redis: `docker stop <redis-container-id>`
2. Visit: http://localhost:3000/announcements
3. ✅ Should still show announcements from markdown files
4. Restart Redis: `docker start <redis-container-id>`

### 7. Verify Data Structure in Redis
```powershell
# Connect to Redis
docker exec -it <redis-container-id> redis-cli

# Check announcements key
GET tcc:announcements

# Should return JSON array of announcements
```

## Expected Results

### Admin Page Card
- ✅ "Manage Announcements" card visible with megaphone icon
- ✅ Clicking navigates to `/admin/announcements`

### Admin Manager
- ✅ Shows count of announcements
- ✅ "Add Announcement" button visible
- ✅ List shows all announcements with image preview
- ✅ Edit/Delete buttons on each announcement
- ✅ Modal opens for add/edit with all fields
- ✅ Validation: slug required, can't duplicate slug
- ✅ Success/error messages display correctly
- ✅ Delete confirmation modal works

### Public Page
- ✅ Announcements sorted by date (newest first)
- ✅ Each announcement shows image, title, description, date
- ✅ Clicking image opens modal with full-size view
- ✅ Modal close button (×) works
- ✅ Click outside modal closes it

### API Responses

#### GET /api/announcements
```json
[
  {
    "id": "campus-ambassador",
    "slug": "campus-ambassador",
    "title": "Campus Ambassador Program",
    "description": "Become a campus ambassador...",
    "image": "/images/announcements/sample.jpeg",
    "date": "2025-01-10"
  }
]
```

#### POST Success
```json
{
  "success": true,
  "announcement": { ... },
  "total": 3
}
```

#### Error Response (Duplicate)
```json
{
  "error": "Announcement with this slug already exists"
}
```

## Performance Checks

### Redis Response Times
All operations should complete in < 10ms:
- ✅ GET all announcements
- ✅ GET single announcement  
- ✅ POST new announcement
- ✅ PUT update
- ✅ DELETE

### Page Load Times
- ✅ Public page: < 500ms
- ✅ Admin page: < 1s

### Network Waterfall
- ✅ API call to `/api/announcements` completes quickly
- ✅ Images load progressively
- ✅ No blocking requests

## Troubleshooting

### Issue: "Redis connection failed"
**Solution:** Make sure Redis is running:
```powershell
docker ps | Select-String redis
# If not running:
docker start <redis-container-id>
```

### Issue: "No announcements available"
**Solution:** Run migration:
```powershell
curl -X POST http://localhost:3000/api/admin/migrate
```

### Issue: Admin pages not accessible
**Solution:** Verify admin user is configured in `.env.local`:
```env
ADMIN_EMAILS=your-email@example.com
```

### Issue: "Announcement with this slug already exists"
**Solution:** Use different slug or delete existing announcement first

### Issue: Images not loading
**Solution:** 
1. Verify image path exists in `public/` folder
2. Check image path starts with `/images/`
3. Update image path in announcement

## Success Criteria

✅ All announcements CRUD operations work
✅ Admin UI is responsive and user-friendly
✅ Public page displays announcements correctly
✅ Redis stores data persistently
✅ Markdown fallback works when Redis is down
✅ Migration successfully moves data to Redis
✅ No TypeScript/ESLint errors
✅ Authentication properly protects admin routes
