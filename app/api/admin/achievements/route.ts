import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Achievement } from '@/lib/types';

const REDIS_KEY = 'tcc:achievements';

// GET all achievements or a single achievement by slug
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

    const achievements: Achievement[] = JSON.parse(data);
    
    // Check if a specific achievement is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const achievement = achievements.find(a => a.slug === slug);
      if (!achievement) {
        return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
      }
      return NextResponse.json(achievement);
    }
    
    // Sort by date descending (newest first)
    const sortedAchievements = achievements.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return NextResponse.json(sortedAchievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

// POST - Create or update all achievements (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingAchievements: Achievement[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single achievement (object)
    if (Array.isArray(body)) {
      // Bulk replace all achievements
      await redis.set(REDIS_KEY, JSON.stringify(body));
      revalidatePath('/achievements');
      return NextResponse.json({ success: true, achievements: body });
    }

    const newAchievement: Achievement = body as Achievement;

    // Validate single achievement minimal requirements
    if (!newAchievement || typeof newAchievement !== 'object' || !newAchievement.slug) {
      return NextResponse.json({ error: 'Invalid achievement payload: slug is required' }, { status: 400 });
    }

    // Prevent duplicates by slug
    const exists = existingAchievements.some(a => a.slug === newAchievement.slug);
    if (exists) {
      return NextResponse.json({ error: 'Achievement with this slug already exists' }, { status: 409 });
    }

    // Ensure id matches slug for consistency
    newAchievement.id = newAchievement.slug;

    // Add to array (sorting happens on retrieval in GET endpoint)
    const updatedAchievements = [...existingAchievements, newAchievement];
    await redis.set(REDIS_KEY, JSON.stringify(updatedAchievements));

    revalidatePath('/achievements');

    return NextResponse.json({ success: true, achievement: newAchievement, total: updatedAchievements.length });
  } catch (error) {
    console.error('Error saving achievements:', error);
    return NextResponse.json({ error: 'Failed to save achievements' }, { status: 500 });
  }
}

// PUT - Update a single achievement
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedAchievement: Achievement = await request.json();
    
    if (!updatedAchievement.slug) {
      return NextResponse.json({ error: 'Achievement slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);

    if (!data) {
      return NextResponse.json({ error: 'No achievements found' }, { status: 404 });
    }

    const achievements: Achievement[] = JSON.parse(data);
    const index = achievements.findIndex(a => a.slug === updatedAchievement.slug);

    if (index === -1) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    // Ensure id matches slug
    updatedAchievement.id = updatedAchievement.slug;

    achievements[index] = updatedAchievement;
    await redis.set(REDIS_KEY, JSON.stringify(achievements));

    revalidatePath('/achievements');

    return NextResponse.json({ success: true, achievement: updatedAchievement });
  } catch (error) {
    console.error('Error updating achievement:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

// DELETE - Remove an achievement by slug
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Achievement slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);

    if (!data) {
      return NextResponse.json({ error: 'No achievements found' }, { status: 404 });
    }

    const achievements: Achievement[] = JSON.parse(data);
    const filteredAchievements = achievements.filter(a => a.slug !== slug);

    if (filteredAchievements.length === achievements.length) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    await redis.set(REDIS_KEY, JSON.stringify(filteredAchievements));

    revalidatePath('/achievements');

    return NextResponse.json({ success: true, message: 'Achievement deleted' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
