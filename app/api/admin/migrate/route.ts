import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Program, Research, Testimonial, GalleryItem } from '@/lib/types';

const contentRoot = path.join(process.cwd(), 'content');

function readMarkdownDir<T>(sub: string, mapFn: (data: any, slug: string) => T): T[] {
  const dir = path.join(contentRoot, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(file => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return mapFn({ ...data, content }, slug);
  });
}

export async function POST() {
  try {
    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ 
        error: 'Redis connection failed',
        message: 'Could not connect to Redis. Please ensure Redis is running.'
      }, { status: 503 });
    }

    const redis = getRedisClient();
    
    // Migrate programs
    const programs: Program[] = readMarkdownDir('programs', (d, slug) => ({ slug, ...d }));
    if (programs.length > 0) {
      await redis.set('tcc:programs', JSON.stringify(programs));
    }
    
    // Migrate research
    const research: Research[] = readMarkdownDir('research', (d, slug) => ({ slug, ...d }));
    if (research.length > 0) {
      await redis.set('tcc:research', JSON.stringify(research));
    }
    
    // Migrate testimonials
    const testimonials: Testimonial[] = readMarkdownDir('testimonials', (d, slug) => ({ id: slug, ...d }));
    if (testimonials.length > 0) {
      await redis.set('tcc:testimonials', JSON.stringify(testimonials));
    }
    
    // Migrate gallery
    const gallery: GalleryItem[] = readMarkdownDir('gallery', (d, slug) => ({ id: slug, ...d }));
    if (gallery.length > 0) {
      await redis.set('tcc:gallery', JSON.stringify(gallery));
    }

    return NextResponse.json({
      success: true,
      migrated: {
        programs: programs.length,
        research: research.length,
        testimonials: testimonials.length,
        gallery: gallery.length,
      },
      message: 'Content successfully migrated from markdown files to Redis'
    });
  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to migrate content from markdown files to Redis'
  });
}
