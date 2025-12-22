/**
 * Redis Restore Script
 * 
 * Restores TCC content from a backup JSON file to Redis
 * Run: node scripts/restore-redis.js backups/redis-backup-YYYY-MM-DD.json
 * 
 * Requires REDIS_URL environment variable
 */

const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function restoreRedis(backupFilePath) {
  console.log('\n🔄 Starting Redis restore...\n');
  
  // Validate backup file
  if (!backupFilePath) {
    console.error('❌ ERROR: No backup file specified');
    console.error('   Usage: node scripts/restore-redis.js backups/redis-backup-YYYY-MM-DD.json\n');
    process.exit(1);
  }

  const fullPath = path.resolve(backupFilePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ ERROR: Backup file not found: ${fullPath}\n`);
    process.exit(1);
  }

  // Check for Redis URL
  if (!process.env.REDIS_URL) {
    console.error('❌ ERROR: REDIS_URL environment variable not found');
    console.error('   Add REDIS_URL to your .env.local file\n');
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

    // Load backup file
    console.log(`📂 Loading backup from: ${path.basename(fullPath)}`);
    const backupData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    console.log(`⏰ Backup timestamp: ${backupData.timestamp}`);
    console.log(`🌍 Environment: ${backupData.environment}\n`);

    // Confirm restore
    console.log('⚠️  This will overwrite existing Redis data!');
    console.log('   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Restore each key
    let restoredCount = 0;
    for (const [key, data] of Object.entries(backupData.data)) {
      if (data === null) {
        console.log(`⏭️  Skipping ${key} (no data in backup)`);
        continue;
      }

      console.log(`📥 Restoring ${key}...`);
      try {
        const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
        await redis.set(key, jsonData);
        
        const itemCount = Array.isArray(data) ? data.length : 1;
        console.log(`   ✅ ${itemCount} item(s) restored`);
        restoredCount++;
      } catch (error) {
        console.error(`   ❌ Failed to restore ${key}:`, error.message);
      }
    }

    console.log('\n✅ Restore completed successfully!');
    console.log(`📊 Keys restored: ${restoredCount}/${Object.keys(backupData.data).length}\n`);

  } catch (error) {
    console.error('\n❌ Restore failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check backup file is valid JSON');
    console.error('2. Verify REDIS_URL is correct');
    console.error('3. Ensure Redis server is accessible\n');
    process.exit(1);
  } finally {
    redis.disconnect();
  }
}

// Get backup file from command line arguments
const backupFile = process.argv[2];
restoreRedis(backupFile);
