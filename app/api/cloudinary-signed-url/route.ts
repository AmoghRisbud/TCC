import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    // Check if it's a Cloudinary URL
    if (!url.includes('res.cloudinary.com/')) {
      return NextResponse.json({ error: 'Not a Cloudinary URL' }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{public_id}
    const match = url.match(/\/raw\/upload\/v\d+\/(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid Cloudinary URL format' }, { status: 400 });
    }

    const publicId = match[1];

    // Generate signed URL with authentication (valid for 1 hour)
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json({ 
      error: 'Failed to generate signed URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
