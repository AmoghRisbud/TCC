import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Testimonial } from '@/lib/types';

const REDIS_KEY = 'tcc:testimonials';

// GET all testimonials
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

    const testimonials: Testimonial[] = JSON.parse(data);
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

    const testimonials: Testimonial[] = await request.json();
    
    // Validate data
    if (!Array.isArray(testimonials)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const redis = getRedisClient();
    await redis.set(REDIS_KEY, JSON.stringify(testimonials));

    return NextResponse.json({ success: true, testimonials });
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

    return NextResponse.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE - Delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Testimonial id is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const testimonials: Testimonial[] = data ? JSON.parse(data) : [];
    
    const filteredTestimonials = testimonials.filter(t => t.id !== id);

    await redis.set(REDIS_KEY, JSON.stringify(filteredTestimonials));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
