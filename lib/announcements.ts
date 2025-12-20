import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Announcement } from './types';
import { getRedisClient, ensureRedisConnection } from './redis';

const contentRoot = path.join(process.cwd(), 'content');

function readMarkdownDir<T>(sub: string, mapFn: (data: any, slug: string) => T): T[] {
  const dir = path.join(contentRoot, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = matter(raw);
      return mapFn({ ...data }, slug);
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

export const getAnnouncements = async (): Promise<Announcement[]> => {
  return getFromRedisOrMarkdown('tcc:announcements', 'announcements', (d, slug) => ({
    slug,
    id: slug,
    ...d,
  }));
};

