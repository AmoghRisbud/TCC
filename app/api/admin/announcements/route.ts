import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Announcement } from '@/lib/types';

const REDIS_KEY = 'tcc:announcements';

// GET all announcements or a single announcement by slug
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

    const announcements: Announcement[] = JSON.parse(data);
    
    // Check if a specific announcement is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const announcement = announcements.find(a => a.slug === slug);
      if (!announcement) {
        return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
      }
      return NextResponse.json(announcement);
    }
    
    // Sort by date descending (newest first)
    const sortedAnnouncements = announcements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json(sortedAnnouncements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

// POST - Create or update all announcements (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingAnnouncements: Announcement[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single announcement (object)
    if (Array.isArray(body)) {
      // Bulk replace all announcements
      await redis.set(REDIS_KEY, JSON.stringify(body));
      revalidatePath('/announcements');
      revalidatePath('/announcements/[slug]', 'page');
      return NextResponse.json({ success: true, announcements: body });
    }

    const newAnnouncement: Announcement = body as Announcement;

    // Validate single announcement minimal requirements
    if (!newAnnouncement || typeof newAnnouncement !== 'object' || !newAnnouncement.slug) {
      return NextResponse.json({ error: 'Invalid announcement payload: slug is required' }, { status: 400 });
    }

    // Prevent duplicates by slug
    const exists = existingAnnouncements.some(a => a.slug === newAnnouncement.slug);
    if (exists) {
      return NextResponse.json({ error: 'Announcement with this slug already exists' }, { status: 409 });
    }

    // Ensure id matches slug for consistency
    newAnnouncement.id = newAnnouncement.slug;

    const updatedAnnouncements = [...existingAnnouncements, newAnnouncement];
    await redis.set(REDIS_KEY, JSON.stringify(updatedAnnouncements));

    revalidatePath('/announcements');
    revalidatePath('/announcements/[slug]', 'page');

    return NextResponse.json({ success: true, announcement: newAnnouncement, total: updatedAnnouncements.length });
  } catch (error) {
    console.error('Error saving announcements:', error);
    return NextResponse.json({ error: 'Failed to save announcements' }, { status: 500 });
  }
}

// PUT - Update a single announcement
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedAnnouncement: Announcement = await request.json();
    
    if (!updatedAnnouncement.slug) {
      return NextResponse.json({ error: 'Announcement slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);

    if (!data) {
      return NextResponse.json({ error: 'No announcements found' }, { status: 404 });
    }

    const announcements: Announcement[] = JSON.parse(data);
    const index = announcements.findIndex(a => a.slug === updatedAnnouncement.slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    // Ensure id matches slug
    updatedAnnouncement.id = updatedAnnouncement.slug;

    announcements[index] = updatedAnnouncement;
    await redis.set(REDIS_KEY, JSON.stringify(announcements));

    revalidatePath('/announcements');
    revalidatePath('/announcements/[slug]', 'page');

    return NextResponse.json({ success: true, announcement: updatedAnnouncement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

// DELETE - Remove an announcement by slug
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);

    if (!data) {
      return NextResponse.json({ error: 'No announcements found' }, { status: 404 });
    }

    const announcements: Announcement[] = JSON.parse(data);
    const filtered = announcements.filter(a => a.slug !== slug);

    if (filtered.length === announcements.length) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    await redis.set(REDIS_KEY, JSON.stringify(filtered));

    revalidatePath('/announcements');
    revalidatePath('/announcements/[slug]', 'page');

    return NextResponse.json({ success: true, message: 'Announcement deleted', remaining: filtered.length });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
