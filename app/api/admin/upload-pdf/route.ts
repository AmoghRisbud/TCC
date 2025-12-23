import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Ensure Cloudinary credentials are present
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables not configured');
      return NextResponse.json({ error: 'Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in environment.' }, { status: 500 });
    }

    // Upload to Cloudinary as raw resource with public access
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: 'tcc/research',
      resource_type: 'raw',
      type: 'upload', // Ensures public access (not authenticated)
      access_mode: 'public', // Explicitly set to public
      // keep original filename as public_id base (sanitized)
      public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
      use_filename: false,
      unique_filename: true,
    });

    const publicUrl = uploadResult.secure_url;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'PDF uploaded successfully to Cloudinary',
      cloudinary_id: uploadResult.public_id,
    });
    
  } catch (error) {
    console.error('Error uploading PDF:', error);
    return NextResponse.json({ 
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
