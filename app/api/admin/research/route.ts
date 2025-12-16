import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Research } from '@/lib/types';

const REDIS_KEY = 'tcc:research';

// GET all research articles
export async function GET() {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    
    if (!data) {
      return NextResponse.json([]);
    }

    const research: Research[] = JSON.parse(data);
    return NextResponse.json(research);
  } catch (error) {
    console.error('Error fetching research articles:', error);
    return NextResponse.json({ error: 'Failed to fetch research articles' }, { status: 500 });
  }
}

// POST - Create or update all research articles (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const research: Research[] = await request.json();
    
    // Validate data
    if (!Array.isArray(research)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.set(REDIS_KEY, JSON.stringify(research));

    return NextResponse.json({ success: true, research });
  } catch (error) {
    console.error('Error saving research articles:', error);
    return NextResponse.json({ error: 'Failed to save research articles' }, { status: 500 });
  }
}

// PUT - Update a single research article
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedResearch: Research = await request.json();
    
    if (!updatedResearch.slug) {
      return NextResponse.json({ error: 'Research article slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const research: Research[] = data ? JSON.parse(data) : [];
    
    const index = research.findIndex(r => r.slug === updatedResearch.slug);
    
    if (index >= 0) {
      research[index] = updatedResearch;
    } else {
      research.push(updatedResearch);
    }

    await redis.set(REDIS_KEY, JSON.stringify(research));

    return NextResponse.json({ success: true, research: updatedResearch });
  } catch (error) {
    console.error('Error updating research article:', error);
    return NextResponse.json({ error: 'Failed to update research article' }, { status: 500 });
  }
}

// DELETE - Delete a research article
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Research article slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const research: Research[] = data ? JSON.parse(data) : [];
    
    const filteredResearch = research.filter(r => r.slug !== slug);

    await redis.set(REDIS_KEY, JSON.stringify(filteredResearch));

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error deleting research article:', error);
    return NextResponse.json({ error: 'Failed to delete research article' }, { status: 500 });
  }
}
