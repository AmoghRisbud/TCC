import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Program, Research, Testimonial, TeamMember, Job, GalleryItem, SiteSettings } from './types';
import { getRedisClient, ensureRedisConnection } from './redis';

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

// Helper function to fetch from Redis with fallback to markdown
async function getFromRedisOrMarkdown<T>(
  redisKey: string,
  markdownDir: string,
  mapFn: (data: any, slug: string) => T
): Promise<T[]> {
  try {
    const connected = await ensureRedisConnection();
    if (connected) {
      const redis = getRedisClient();
      const data = await redis.get(redisKey);
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error(`Error fetching from Redis (${redisKey}):`, error);
  }
  // Fallback to markdown files
  return readMarkdownDir(markdownDir, mapFn);
}

export const getPrograms = async (): Promise<Program[]> => {
  return getFromRedisOrMarkdown('tcc:programs', 'programs', (d, slug) => ({ slug, ...d }));
};

export const getResearch = async (): Promise<Research[]> => {
  return getFromRedisOrMarkdown('tcc:research', 'research', (d, slug) => ({ slug, ...d }));
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return getFromRedisOrMarkdown('tcc:testimonials', 'testimonials', (d, slug) => ({ id: slug, ...d }));
};

export const getGallery = async (): Promise<GalleryItem[]> => {
  return getFromRedisOrMarkdown('tcc:gallery', 'gallery', (d, slug) => ({ id: slug, ...d }));
};

// Keep these as sync functions since they're not managed in Redis
export const getTeam = (): TeamMember[] => readMarkdownDir('team', (d, slug) => ({ slug, ...d }));
export const getJobs = (): Job[] => readMarkdownDir('jobs', (d, slug) => ({ slug, ...d }));
export const getSiteSettings = (): SiteSettings => {
  const file = path.join(contentRoot, 'settings', 'site.md');
  if (!fs.existsSync(file)) return { siteName: 'TCC' };
  const raw = fs.readFileSync(file, 'utf-8');
  const { data } = matter(raw);
  return { siteName: 'TCC', ...data };
};
