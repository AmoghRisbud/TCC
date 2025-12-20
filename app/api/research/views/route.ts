import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';

const VIEW_KEY_PREFIX = 'tcc:research:views:';

// GET view count for a research article
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const connected = await ensureRedisConnection();
    if (!connected) {
      // Return default value if Redis is unavailable
      return NextResponse.json({ slug, views: 0 });
    }

    const redis = getRedisClient();
    const viewKey = `${VIEW_KEY_PREFIX}${slug}`;
    const views = await redis.get(viewKey);

    return NextResponse.json({ 
      slug, 
      views: views ? parseInt(views) : 0 
    });
  } catch (error) {
    console.error('Error fetching research views:', error);
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 });
  }
}

// POST to increment view count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const redis = getRedisClient();
    const viewKey = `${VIEW_KEY_PREFIX}${slug}`;
    
    // Increment the view count
    const newViews = await redis.incr(viewKey);

    return NextResponse.json({ 
      slug, 
      views: newViews,
      success: true 
    });
  } catch (error) {
    console.error('Error incrementing research views:', error);
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 });
  }
}
