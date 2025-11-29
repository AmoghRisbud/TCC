import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Program, Project, Testimonial, TeamMember, Job, GalleryItem, SiteSettings } from './types';

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

export const getPrograms = (): Program[] => readMarkdownDir('programs', (d, slug) => ({ slug, ...d }));
export const getProjects = (): Project[] => readMarkdownDir('projects', (d, slug) => ({ slug, ...d }));
export const getTestimonials = (): Testimonial[] => readMarkdownDir('testimonials', (d, slug) => ({ id: slug, ...d }));
export const getTeam = (): TeamMember[] => readMarkdownDir('team', (d, slug) => ({ slug, ...d }));
export const getJobs = (): Job[] => readMarkdownDir('jobs', (d, slug) => ({ slug, ...d }));
export const getGallery = (): GalleryItem[] => readMarkdownDir('gallery', (d, slug) => ({ id: slug, ...d }));
export const getSiteSettings = (): SiteSettings => {
  const file = path.join(contentRoot, 'settings', 'site.md');
  if (!fs.existsSync(file)) return { siteName: 'TCC' };
  const raw = fs.readFileSync(file, 'utf-8');
  const { data } = matter(raw);
  return { siteName: 'TCC', ...data };
};
