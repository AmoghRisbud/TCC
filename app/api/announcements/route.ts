import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/announcements';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    // Ensure sorting by date descending (newest first)
    const sorted = announcements.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
