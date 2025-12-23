import { NextRequest, NextResponse } from 'next/server';

// Upload PDFs to Vercel Blob storage and return a same-origin proxy URL
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ 
        error: 'Invalid file type. Only PDF files are allowed' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Ensure Vercel API token is configured
    if (!process.env.VERCEL_TOKEN) {
      console.error('VERCEL_TOKEN is not configured');
      return NextResponse.json({ error: 'Vercel not configured. Please set VERCEL_TOKEN in environment.' }, { status: 500 });
    }

    // Step 1: Request an upload slot from Vercel Blob API
    const createRes = await fetch('https://api.vercel.com/v1/blob', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: file.name,
        size: file.size,
        contentType: file.type
      })
    });

    if (!createRes.ok) {
      const body = await createRes.text();
      console.error('Failed to create Vercel blob:', createRes.status, body);
      return NextResponse.json({ error: 'Failed to create upload slot on Vercel' }, { status: 500 });
    }

    const createJson = await createRes.json();
    // Expecting { id, uploadUrl, url } or similar
    const { id, uploadUrl, url } = createJson as any;

    if (!id || !uploadUrl) {
      console.error('Unexpected response from Vercel blob creation:', createJson);
      return NextResponse.json({ error: 'Unexpected Vercel response' }, { status: 500 });
    }

    // Step 2: Upload the raw bytes to the uploadUrl
    const bytes = await file.arrayBuffer();
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: Buffer.from(bytes)
    });

    if (!putRes.ok) {
      const text = await putRes.text();
      console.error('Failed to PUT file to Vercel upload url:', putRes.status, text);
      return NextResponse.json({ error: 'Failed to upload file to Vercel storage' }, { status: 500 });
    }

    // Return a same-origin proxy path that can be used in the UI and validated safely
    const proxyUrl = `/api/admin/blob/${encodeURIComponent(id)}`;

    return NextResponse.json({ success: true, url: proxyUrl, id, vercelUrl: url || null });

  } catch (error) {
    console.error('Error uploading PDF to Vercel Blob:', error);
    return NextResponse.json({ 
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
