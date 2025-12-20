import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/announcements';

export async function GET() {
  try {
    const announcements = await getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
