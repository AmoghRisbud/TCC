import Redis from 'ioredis';

/**
 * Redis Client for TCC Frontend
 * Supports both local development and Upstash Redis production deployment
 * Uses ioredis for compatibility with both environments
 */

let redis: Redis | null = null;

/**
 * Get or create Redis client instance (singleton pattern)
 * Supports Upstash Redis URLs with TLS (rediss://)
 * 
 * @returns {Redis} Redis client instance
 * @throws {Error} If REDIS_URL is not configured
 */
export function getRedisClient(): Redis {
  if (!redis) {
    // Use Redis connection URL from environment variable or default to localhost
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    // Check if using Upstash (rediss:// protocol)
    const isUpstash = redisUrl.startsWith('rediss://');
    const isProd = process.env.NODE_ENV === 'production';
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
      // Connect immediately in production, lazily in development
      lazyConnect: !isProd,
      connectTimeout: 10000,
      enableReadyCheck: true,
      // Enable TLS for Upstash (rediss://)
      tls: isUpstash ? {} : undefined,
      family: 4, // Force IPv4 for better compatibility
      // Keepalive for serverless environments
      keepAlive: 30000,
    });

    // Connection event handlers
    redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message);
    });

    redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redis.on('ready', () => {
      console.log('✅ Redis ready for commands');
    });

    redis.on('close', () => {
      console.log('🔌 Redis connection closed');
    });

    redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });
  }

  return redis;
}

/**
 * Test Redis connection with timeout
 * Used for health checks and startup validation
 * 
 * @returns {Promise<boolean>} True if connection successful, false otherwise
 */
export async function ensureRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    
    // If not connected, attempt connection
    if (client.status === 'wait' || client.status === 'close' || client.status === 'end') {
      await client.connect();
    }
    
    // Test connection with 5-second timeout
    const pingPromise = client.ping();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Redis ping timeout (5s)')), 5000)
    );
    
    await Promise.race([pingPromise, timeoutPromise]);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to connect to Redis:', errorMessage);
    
    // In production, provide helpful context
    if (process.env.NODE_ENV === 'production') {
      console.error('💡 Check Upstash Redis configuration and REDIS_URL environment variable');
    }
    
    return false;
  }
}

/**
 * Close Redis connection gracefully
 * Should be called during application shutdown
 */
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      redis = null;
      console.log('✅ Redis connection closed gracefully');
    } catch (error) {
      console.error('❌ Error closing Redis connection:', error);
      // Force close if graceful shutdown fails
      if (redis) {
        redis.disconnect();
      }
      redis = null;
    }
  }
}

export default getRedisClient;
