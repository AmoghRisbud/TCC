import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Testimonial } from '@/lib/types';

const REDIS_KEY = 'tcc:testimonials';

// GET all testimonials or a single testimonial by id
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

    const testimonials: Testimonial[] = JSON.parse(data);
    
    // Check if a specific testimonial is requested
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) {
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
      }
      return NextResponse.json(testimonial);
    }
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST - Create or update all testimonials (bulk operation)
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const body = await request.json();

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingTestimonials: Testimonial[] = existingData ? JSON.parse(existingData) : [];

    // Support both bulk (array) and single testimonial (object)
    if (Array.isArray(body)) {
      await redis.set(REDIS_KEY, JSON.stringify(body));
      revalidatePath('/testimonials');
      return NextResponse.json({ success: true, testimonials: body });
    }

    const newTestimonial: Testimonial = body as Testimonial;

    if (!newTestimonial || typeof newTestimonial !== 'object' || !newTestimonial.id) {
      return NextResponse.json({ error: 'Invalid testimonial payload: id is required' }, { status: 400 });
    }

    const exists = existingTestimonials.some(t => t.id === newTestimonial.id);
    if (exists) {
      return NextResponse.json({ error: 'Testimonial with this id already exists' }, { status: 409 });
    }

    const updatedTestimonials = [...existingTestimonials, newTestimonial];
    await redis.set(REDIS_KEY, JSON.stringify(updatedTestimonials));

    revalidatePath('/testimonials');

    return NextResponse.json({ success: true, testimonial: newTestimonial, total: updatedTestimonials.length });
  } catch (error) {
    console.error('Error saving testimonials:', error);
    return NextResponse.json({ error: 'Failed to save testimonials' }, { status: 500 });
  }
}

// PUT - Update a single testimonial
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedTestimonial: Testimonial = await request.json();
    
    if (!updatedTestimonial.id) {
      return NextResponse.json({ error: 'Testimonial id is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const testimonials: Testimonial[] = data ? JSON.parse(data) : [];
    
    const index = testimonials.findIndex(t => t.id === updatedTestimonial.id);
    
    if (index >= 0) {
      testimonials[index] = updatedTestimonial;
    } else {
      testimonials.push(updatedTestimonial);
    }

    await redis.set(REDIS_KEY, JSON.stringify(testimonials));

    revalidatePath('/testimonials');

    return NextResponse.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE - Delete one or multiple testimonials
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
      return NextResponse.json({ error: 'Testimonial id or ids parameter is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const testimonials: Testimonial[] = data ? JSON.parse(data) : [];
    
    const filteredTestimonials = testimonials.filter(t => !idsToDelete.includes(t.id));
    const deletedCount = testimonials.length - filteredTestimonials.length;

    await redis.set(REDIS_KEY, JSON.stringify(filteredTestimonials));

    revalidatePath('/testimonials');

    return NextResponse.json({ 
      success: true, 
      deletedCount,
      deletedIds: idsToDelete.filter(id => testimonials.some(t => t.id === id))
    });
  } catch (error) {
    console.error('Error deleting testimonial(s):', error);
    return NextResponse.json({ error: 'Failed to delete testimonial(s)' }, { status: 500 });
  }
}
