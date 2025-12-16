import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { GalleryItem } from '@/lib/types';

const REDIS_KEY = 'tcc:gallery';

// GET all gallery items
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

    const gallery: GalleryItem[] = JSON.parse(data);
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST - Create or update all gallery items (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const gallery: GalleryItem[] = await request.json();
    
    // Validate data
    if (!Array.isArray(gallery)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.set(REDIS_KEY, JSON.stringify(gallery));

    return NextResponse.json({ success: true, gallery });
  } catch (error) {
    console.error('Error saving gallery items:', error);
    return NextResponse.json({ error: 'Failed to save gallery items' }, { status: 500 });
  }
}

// PUT - Update a single gallery item
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedItem: GalleryItem = await request.json();
    
    if (!updatedItem.id) {
      return NextResponse.json({ error: 'Gallery item id is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const gallery: GalleryItem[] = data ? JSON.parse(data) : [];
    
    const index = gallery.findIndex(g => g.id === updatedItem.id);
    
    if (index >= 0) {
      gallery[index] = updatedItem;
    } else {
      gallery.push(updatedItem);
    }

    await redis.set(REDIS_KEY, JSON.stringify(gallery));

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE - Delete a gallery item
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Gallery item id is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const gallery: GalleryItem[] = data ? JSON.parse(data) : [];
    
    const filteredGallery = gallery.filter(g => g.id !== id);

    await redis.set(REDIS_KEY, JSON.stringify(filteredGallery));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
