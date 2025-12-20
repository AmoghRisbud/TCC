import { NextRequest, NextResponse } from 'next/server';
import { getResearch } from '@/lib/content';

// GET all research articles (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const research = await getResearch();
    
    // Check if a specific research is requested
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      const article = research.find(r => r.slug === slug);
      if (!article) {
        return NextResponse.json({ error: 'Research article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }
    
    return NextResponse.json(research);
  } catch (error) {
    console.error('Error fetching research:', error);
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}
