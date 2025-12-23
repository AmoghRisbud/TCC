import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body?.url;
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Only allow checking trusted hosts (Cloudinary, Vercel Blob, or same-origin) for safety
    const sameOriginHost = new URL(process.env.NEXTAUTH_URL || (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')).host;
    const allowedHostSuffixes = [
      'res.cloudinary.com',
      'vercel.com',
      'vercel.app',
      'vercel-storage.com',
      'vercel.pub',
    ];

    try {
      const parsed = new URL(url);
      // Allow if same-origin or matches any trusted suffix
      const isSameOrigin = parsed.host === sameOriginHost || parsed.host.endsWith('.' + sameOriginHost);
      const isTrusted = allowedHostSuffixes.some(h => parsed.host === h || parsed.host.endsWith('.' + h));
      if (!isSameOrigin && !isTrusted) {
        return NextResponse.json({ error: `Host not allowed for check: ${parsed.host}` }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    // Perform a fetch and read a small portion to verify PDF signature
    const res = await fetch(url, { 
      method: 'GET', 
      headers: { 
        'Accept': 'application/pdf, application/octet-stream',
        'User-Agent': 'Mozilla/5.0 (compatible; TCC-PDFValidator/1.0)'
      },
      redirect: 'follow'
    });
    
    const contentType = res.headers.get('content-type') || null;
    const contentLength = res.headers.get('content-length') || null;
    const ok = res.ok;

    if (!ok) {
      return NextResponse.json({ 
        ok: false, 
        contentType, 
        contentLength, 
        startsWithPdf: false,
        error: `HTTP ${res.status}: ${res.statusText}`
      });
    }

    // Read first bytes to check PDF magic number
    const reader = res.body?.getReader();
    let startsWithPdf = false;
    let readError = null;
    
    if (reader) {
      try {
        const { value, done } = await reader.read();
        if (value && value.length >= 4) {
          const header = Buffer.from(value).slice(0, 4).toString('utf8');
          startsWithPdf = header === '%PDF';
          
          // Log for debugging
          console.log('PDF validation:', {
            url: url.substring(0, 100),
            contentType,
            headerBytes: value.slice(0, 4),
            headerString: header,
            startsWithPdf
          });
        } else {
          readError = 'No bytes read from response';
        }
        // Close reader
        if (!done) {
          try { await reader.cancel(); } catch (e) { /* noop */ }
        }
      } catch (err) {
        readError = err instanceof Error ? err.message : String(err);
        console.error('Error reading PDF bytes:', err);
      }
    } else {
      readError = 'No response body available';
    }

    return NextResponse.json({ 
      ok, 
      contentType, 
      contentLength, 
      startsWithPdf,
      ...(readError && { readError })
    });
  } catch (error) {
    console.error('PDF info check failed:', error);
    return NextResponse.json({ error: 'Failed to check PDF' }, { status: 500 });
  }
}
