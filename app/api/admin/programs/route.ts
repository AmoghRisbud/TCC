import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Program } from '@/lib/types';

const REDIS_KEY = 'tcc:programs';

// GET all programs or a single program by slug
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

    const programs: Program[] = JSON.parse(data);
    
    // Check if a specific program is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const program = programs.find(p => p.slug === slug);
      if (!program) {
        return NextResponse.json({ error: 'Program not found' }, { status: 404 });
      }
      return NextResponse.json(program);
    }
    
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

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingPrograms: Program[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single program (object)
    if (Array.isArray(body)) {
      // Bulk replace all programs
      await redis.set(REDIS_KEY, JSON.stringify(body));
      return NextResponse.json({ success: true, programs: body });
    }

    const newProgram: Program = body as Program;

    // Validate single program minimal requirements
    if (!newProgram || typeof newProgram !== 'object' || !newProgram.slug) {
      return NextResponse.json({ error: 'Invalid program payload: slug is required' }, { status: 400 });
    }

    // Prevent duplicates by slug
    const exists = existingPrograms.some(p => p.slug === newProgram.slug);
    if (exists) {
      return NextResponse.json({ error: 'Program with this slug already exists' }, { status: 409 });
    }

    const updatedPrograms = [...existingPrograms, newProgram];
    await redis.set(REDIS_KEY, JSON.stringify(updatedPrograms));

    // Revalidate programs pages and homepage (in case featured changed)
    revalidatePath('/programs');
    revalidatePath('/programs/[slug]', 'page');
    revalidatePath('/');

    return NextResponse.json({ success: true, program: newProgram, total: updatedPrograms.length });
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

    // Revalidate programs pages and homepage (in case featured changed)
    revalidatePath('/programs');
    revalidatePath('/programs/[slug]', 'page');
    revalidatePath('/');

    return NextResponse.json({ success: true, program: updatedProgram });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

// DELETE - Delete one or multiple programs
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
      return NextResponse.json({ error: 'Program slug or slugs parameter is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const programs: Program[] = data ? JSON.parse(data) : [];
    
    const filteredPrograms = programs.filter(p => !slugsToDelete.includes(p.slug));
    const deletedCount = programs.length - filteredPrograms.length;

    await redis.set(REDIS_KEY, JSON.stringify(filteredPrograms));

    // Revalidate programs pages and homepage (in case featured changed)
    revalidatePath('/programs');
    revalidatePath('/programs/[slug]', 'page');
    revalidatePath('/');

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      deletedSlugs: slugsToDelete.filter(slug => programs.some(p => p.slug === slug))
    });
  } catch (error) {
    console.error('Error deleting program(s):', error);
    return NextResponse.json({ error: 'Failed to delete program(s)' }, { status: 500 });
  }
}
