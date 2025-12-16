import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Research } from '@/lib/types';

const REDIS_KEY = 'tcc:research';

// GET all research articles or a single article by slug
export async function GET(request: NextRequest) {
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
    
    // Check if a specific article is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const article = research.find(r => r.slug === slug);
      if (!article) {
        return NextResponse.json({ error: 'Research article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }
    
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

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingResearch: Research[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single article (object)
    if (Array.isArray(body)) {
      await redis.set(REDIS_KEY, JSON.stringify(body));
      return NextResponse.json({ success: true, research: body });
    }

    const newArticle: Research = body as Research;

    if (!newArticle || typeof newArticle !== 'object' || !newArticle.slug) {
      return NextResponse.json({ error: 'Invalid research payload: slug is required' }, { status: 400 });
    }

    const exists = existingResearch.some(r => r.slug === newArticle.slug);
    if (exists) {
      return NextResponse.json({ error: 'Research article with this slug already exists' }, { status: 409 });
    }

    const updatedResearch = [...existingResearch, newArticle];
    await redis.set(REDIS_KEY, JSON.stringify(updatedResearch));

    return NextResponse.json({ success: true, research: newArticle, total: updatedResearch.length });
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

// DELETE - Delete one or multiple research articles
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const slugsParam = searchParams.get('slugs');
    
    // Support both single and bulk delete
    let slugsToDelete: string[] = [];
    
    if (slug) {
      slugsToDelete = [slug];
    } else if (slugsParam) {
      slugsToDelete = slugsParam.split(',').map(s => s.trim());
    } else {
      return NextResponse.json({ error: 'Research article slug or slugs parameter is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const research: Research[] = data ? JSON.parse(data) : [];
    
    const filteredResearch = research.filter(r => !slugsToDelete.includes(r.slug));
    const deletedCount = research.length - filteredResearch.length;

    await redis.set(REDIS_KEY, JSON.stringify(filteredResearch));

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      deletedSlugs: slugsToDelete.filter(slug => research.some(r => r.slug === slug))
    });
  } catch (error) {
    console.error('Error deleting research article(s):', error);
    return NextResponse.json({ error: 'Failed to delete research article(s)' }, { status: 500 });
  }
}
