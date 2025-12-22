import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Job } from '@/lib/types';

const REDIS_KEY = 'tcc:careers';

// Helper function to generate URL-friendly slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// GET all jobs or a single job by slug
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

    let jobs: Job[] = JSON.parse(data);
    
    // Auto-fix: Generate slugs for jobs that don't have them
    let needsUpdate = false;
    jobs = jobs.map(job => {
      if (!job.slug && job.title) {
        needsUpdate = true;
        return { ...job, slug: generateSlug(job.title) };
      }
      return job;
    });
    
    // Save back to Redis if we fixed any slugs
    if (needsUpdate) {
      await redis.set(REDIS_KEY, JSON.stringify(jobs));
    }
    
    // Check if a specific job is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const job = jobs.find(j => j.slug === slug);
      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json(job);
    }
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const body = await request.json();
    const newJob: Job = body as Job;

    if (!newJob || !newJob.slug || !newJob.title) {
      return NextResponse.json({ error: 'Invalid job payload: slug and title are required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const existingData = await redis.get(REDIS_KEY);
    const existingJobs: Job[] = existingData ? JSON.parse(existingData) : [];

    const exists = existingJobs.some(j => j.slug === newJob.slug);
    if (exists) {
      return NextResponse.json({ error: 'Job with this slug already exists' }, { status: 409 });
    }

    const updatedJobs = [...existingJobs, newJob];
    await redis.set(REDIS_KEY, JSON.stringify(updatedJobs));

    revalidatePath('/careers');

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}

// PUT - Update a job
export async function PUT(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const updatedJob: Job = await request.json();
    
    if (!updatedJob.slug) {
      return NextResponse.json({ error: 'Job slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const jobs: Job[] = data ? JSON.parse(data) : [];
    
    const index = jobs.findIndex(j => j.slug === updatedJob.slug);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    jobs[index] = { ...jobs[index], ...updatedJob };
    await redis.set(REDIS_KEY, JSON.stringify(jobs));

    revalidatePath('/careers');

    return NextResponse.json({ success: true, job: jobs[index] });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE - Remove a job
export async function DELETE(request: NextRequest) {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Job slug is required' }, { status: 400 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    const jobs: Job[] = data ? JSON.parse(data) : [];
    
    const filteredJobs = jobs.filter(j => j.slug !== slug);
    
    if (filteredJobs.length === jobs.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await redis.set(REDIS_KEY, JSON.stringify(filteredJobs));

    revalidatePath('/careers');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
