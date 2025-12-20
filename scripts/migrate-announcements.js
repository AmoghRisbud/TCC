// Migration script to move announcements from markdown to Redis
// Run with: node scripts/migrate-announcements.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const Redis = require('ioredis');

const contentRoot = path.join(process.cwd(), 'content');

function readMarkdownDir(sub) {
  const dir = path.join(contentRoot, sub);
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }
  
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = matter(raw);
      return { slug, id: slug, ...data };
    });
}

async function migrate() {
  try {
    // Connect to Redis
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    
    console.log('Connected to Redis');
    
    // Read announcements from markdown
    const announcements = readMarkdownDir('announcements');
    console.log(`Found ${announcements.length} announcements in markdown files`);
    
    if (announcements.length > 0) {
      // Store in Redis
      await redis.set('tcc:announcements', JSON.stringify(announcements));
      console.log(`✅ Successfully migrated ${announcements.length} announcements to Redis`);
      
      // Verify
      const stored = await redis.get('tcc:announcements');
      const parsed = JSON.parse(stored);
      console.log('Verified announcements in Redis:', parsed.map(a => a.title));
    } else {
      console.log('No announcements found to migrate');
    }
    
    redis.disconnect();
    console.log('\n✨ Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
