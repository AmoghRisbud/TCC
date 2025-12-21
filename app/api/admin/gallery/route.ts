import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { GalleryItem } from '@/lib/types';

const REDIS_KEY = 'tcc:gallery';

// GET all gallery items or a single item by id
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

    const gallery: GalleryItem[] = JSON.parse(data);
    
    // Check if a specific item is requested
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const item = gallery.find(g => g.id === id);
      if (!item) {
        return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
      }
      return NextResponse.json(item);
    }
    
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

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingGallery: GalleryItem[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single item (object)
    if (Array.isArray(body)) {
      await redis.set(REDIS_KEY, JSON.stringify(body));
      revalidatePath('/media');
      return NextResponse.json({ success: true, gallery: body });
    }

    const newItem: GalleryItem = body as GalleryItem;

    if (!newItem || typeof newItem !== 'object' || !newItem.id) {
      return NextResponse.json({ error: 'Invalid gallery payload: id is required' }, { status: 400 });
    }

    const exists = existingGallery.some(g => g.id === newItem.id);
    if (exists) {
      return NextResponse.json({ error: 'Gallery item with this id already exists' }, { status: 409 });
    }

    const updatedGallery = [...existingGallery, newItem];
    await redis.set(REDIS_KEY, JSON.stringify(updatedGallery));

    revalidatePath('/media');

    return NextResponse.json({ success: true, item: newItem, total: updatedGallery.length });
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

    revalidatePath('/media');

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE - Delete one or multiple gallery items
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idsParam = searchParams.get('ids');
    
    // Support both single and bulk delete
    let idsToDelete: string[] = [];
    
    if (id) {
      idsToDelete = [id];
    } else if (idsParam) {
      idsToDelete = idsParam.split(',').map(i => i.trim());
    } else {
      return NextResponse.json({ error: 'Gallery item id or ids parameter is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const gallery: GalleryItem[] = data ? JSON.parse(data) : [];
    
    const filteredGallery = gallery.filter(g => !idsToDelete.includes(g.id));
    const deletedCount = gallery.length - filteredGallery.length;

    await redis.set(REDIS_KEY, JSON.stringify(filteredGallery));

    revalidatePath('/media');

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      deletedIds: idsToDelete.filter(id => gallery.some(g => g.id === id))
    });
  } catch (error) {
    console.error('Error deleting gallery item(s):', error);
    return NextResponse.json({ error: 'Failed to delete gallery item(s)' }, { status: 500 });
  }
}
