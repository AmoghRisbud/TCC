import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ShareButton from './ShareButton';

// Helper to strip HTML tags server-side
const stripHtml = (html?: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAnnouncement(slug: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/announcements?slug=${slug}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

async function getAllAnnouncements() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/announcements`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.warn('Failed to fetch announcements for static generation:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const announcements = await getAllAnnouncements();
  
  return announcements.map((announcement: any) => ({
    slug: announcement.slug,
  }));
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const announcement = await getAnnouncement(slug);

  if (!announcement) {
    notFound();
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/10 backdrop-blur-sm rounded-full text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>Announcement</span>
            </div>
            <h1 className="h1 mb-4">{announcement.title}</h1>
            <p className="text-white/80 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {announcement.date}
            </p>
          </div>
        </div>
      </section>

      {/* Announcement Content */}
      <section className="section bg-brand-light">
        <div className="container max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {announcement.image && (
              <div className="relative w-full h-[400px] bg-gray-100">
                <Image
                  src={announcement.image}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-brand-muted leading-relaxed">
                  {stripHtml(announcement.description)}
                </p>
              </div>

              {/* Back Button */}
              <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                <Link
                  href="/announcements"
                  className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Announcements
                </Link>

                {/* Share Button */}
                <ShareButton title={announcement.title} description={stripHtml(announcement.description)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
