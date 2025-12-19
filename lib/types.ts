export interface ProgramSession {
  title: string;
  date: string;
  speakers?: string[];
}
export interface Program {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  logo?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  mode?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  thumbnail?: string;
  brochureUrl?: string;
  tags?: string[];
  featured?: boolean;
  status?: string;
  sessions?: ProgramSession[];
}
export interface ProjectMetric {
  label: string;
  value: string;
}
export interface Research {
  slug: string;
  title: string;
  summary: string;
  image: string;
  year?: string;
  client?: string;
  impactMetrics?: ProjectMetric[];
  thumbnail?: string;
  tags?: string[];
  pdf?: string;
}
export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  quote: string;
  rating?: number;
  photo?: string;
  programRef?: string;
  date?: string;
  featured?: boolean;
}
export interface TeamMember {
  slug: string;
  name: string;
  title?: string;
  bio?: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  order?: number;
  category?: string;
  active?: boolean;
}
export interface Job {
  slug: string;
  title: string;
  department?: string;
  location?: string;
  category: string,
  type?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  applyEmail?: string;
  applyUrl?: string;
  closingDate?: string;
  status?: string;
  salaryRange?: string;
}
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  altText?: string;
  album?: string;
  tags?: string[];
  date?: string;
  attribution?: string;
}
export interface SiteSettings {
  siteName: string;
  heroCopy?: string;
  heroImage?: string;
}
