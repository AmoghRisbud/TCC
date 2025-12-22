/**
 * Redis Backup Script
 * 
 * Backs up all TCC content from Redis to a JSON file
 * Run: node scripts/backup-redis.js
 * 
 * Requires REDIS_URL environment variable
 */

const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Redis keys to backup
const KEYS_TO_BACKUP = [
  'tcc:programs',
  'tcc:research',
  'tcc:testimonials',
  'tcc:gallery',
  'tcc:careers',
  'tcc:announcements',
];

async function backupRedis() {
  console.log('\n🔄 Starting Redis backup...\n');
  
  // Check for Redis URL
  if (!process.env.REDIS_URL) {
    console.error('❌ ERROR: REDIS_URL environment variable not found');
    console.error('   Add REDIS_URL to your .env.local file');
    process.exit(1);
  }

  const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    tls: process.env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
  });

  try {
    // Test connection
    await redis.ping();
    console.log('✅ Connected to Redis');

    const backup = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      redisUrl: process.env.REDIS_URL.replace(/:([^:]+)@/, ':****@'), // Hide password
      data: {},
    };

    // Fetch data for each key
    for (const key of KEYS_TO_BACKUP) {
      console.log(`📦 Backing up ${key}...`);
      const data = await redis.get(key);
      
      if (data) {
        try {
          backup.data[key] = JSON.parse(data);
          const itemCount = Array.isArray(backup.data[key]) ? backup.data[key].length : 1;
          console.log(`   ✅ ${itemCount} item(s) backed up`);
        } catch (parseError) {
          console.error(`   ⚠️  Warning: Could not parse data for ${key}`);
          backup.data[key] = data; // Store raw data
        }
      } else {
        console.log(`   ℹ️  No data found for ${key}`);
        backup.data[key] = null;
      }
    }

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `redis-backup-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    // Write backup to file
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

    console.log('\n✅ Backup completed successfully!');
    console.log(`📁 File: ${filepath}`);
    console.log(`📊 Size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);
    console.log(`⏰ Time: ${backup.timestamp}\n`);

    // Summary
    const totalItems = Object.values(backup.data).reduce((sum, items) => {
      if (Array.isArray(items)) return sum + items.length;
      if (items) return sum + 1;
      return sum;
    }, 0);

    console.log(`📈 Summary:`);
    console.log(`   Total keys: ${KEYS_TO_BACKUP.length}`);
    console.log(`   Total items: ${totalItems}`);
    console.log(`   Backup location: backups/${filename}\n`);

  } catch (error) {
    console.error('\n❌ Backup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check REDIS_URL is correct');
    console.error('2. Verify Redis server is accessible');
    console.error('3. Ensure network connectivity\n');
    process.exit(1);
  } finally {
    redis.disconnect();
  }
}

// Run backup
backupRedis();
