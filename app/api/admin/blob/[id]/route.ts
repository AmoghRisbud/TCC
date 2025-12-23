import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    if (!process.env.VERCEL_TOKEN) {
      console.error('VERCEL_TOKEN not configured');
      return NextResponse.json({ error: 'Vercel not configured' }, { status: 500 });
    }

    const apiBase = 'https://api.vercel.com/v1/blob';
    const blobUrl = `${apiBase}/${encodeURIComponent(id)}`;

    // Try fetching the blob info
    const infoRes = await fetch(blobUrl, { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } });

    // If Vercel returns JSON with a public URL, redirect there
    const ct = infoRes.headers.get('content-type') || '';
    if (ct.startsWith('application/json')) {
      const info = await infoRes.json().catch(() => null);
      if (info && (info.url || info.downloadUrl)) {
        const target = info.url || info.downloadUrl;
        return NextResponse.redirect(target);
      }
    }

    // Otherwise, try a direct download endpoint
    const downloadUrls = [
      `${blobUrl}/download`,
      blobUrl
    ];

    for (const u of downloadUrls) {
      const res = await fetch(u, { headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` } });
      if (!res.ok) continue;

      // If it's a redirect, follow by redirecting the client
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (loc) return NextResponse.redirect(loc);
      }

      // If the response has a body, stream it
      if (res.body) {
        const headers = new Headers();
        const contentType = res.headers.get('content-type') || 'application/pdf';
        headers.set('Content-Type', contentType);
        headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
        headers.set('Content-Disposition', `inline; filename="${id}.pdf"`);

        return new NextResponse(res.body, { status: 200, headers });
      }
    }

    return NextResponse.json({ error: 'Blob not found or not accessible' }, { status: 404 });
  } catch (err) {
    console.error('Error proxying Vercel blob:', err);
    return NextResponse.json({ error: 'Internal error fetching blob' }, { status: 500 });
  }
}
