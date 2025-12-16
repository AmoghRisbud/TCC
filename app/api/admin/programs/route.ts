import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Program } from '@/lib/types';

const REDIS_KEY = 'tcc:programs';

// GET all programs
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

    const programs: Program[] = JSON.parse(data);
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

// POST - Create or update all programs (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const programs: Program[] = await request.json();
    
    // Validate data
    if (!Array.isArray(programs)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.set(REDIS_KEY, JSON.stringify(programs));

    return NextResponse.json({ success: true, programs });
  } catch (error) {
    console.error('Error saving programs:', error);
    return NextResponse.json({ error: 'Failed to save programs' }, { status: 500 });
  }
}

// PUT - Update a single program
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedProgram: Program = await request.json();
    
    if (!updatedProgram.slug) {
      return NextResponse.json({ error: 'Program slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const programs: Program[] = data ? JSON.parse(data) : [];
    
    const index = programs.findIndex(p => p.slug === updatedProgram.slug);
    
    if (index >= 0) {
      programs[index] = updatedProgram;
    } else {
      programs.push(updatedProgram);
    }

    await redis.set(REDIS_KEY, JSON.stringify(programs));

    return NextResponse.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

// DELETE - Delete a program
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ error: 'Program slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const programs: Program[] = data ? JSON.parse(data) : [];
    
    const filteredPrograms = programs.filter(p => p.slug !== slug);

    await redis.set(REDIS_KEY, JSON.stringify(filteredPrograms));

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
