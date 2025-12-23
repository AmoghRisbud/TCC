import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ensureRedisConnection } from '@/lib/redis';
import { Research } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const REDIS_KEY = 'tcc:research';

function isCloudinaryUrl(url?: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.host.includes('res.cloudinary.com');
  } catch (e) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const dryMode = params.get('dry') === 'true';

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET' }, { status: 500 });
    }

    const connected = await ensureRedisConnection();
    if (!connected) {
      return NextResponse.json({ error: 'Redis connection failed' }, { status: 503 });
    }

    const redis = getRedisClient();
    const data = await redis.get(REDIS_KEY);
    let research: Research[] = data ? JSON.parse(data) : [];

    // Fallback: if no redis data, nothing to migrate (admin may run global migrate first)
    if (!research || research.length === 0) {
      return NextResponse.json({ success: true, migrated: 0, message: 'No research articles found in Redis' });
    }

    const report = {
      migrated: [] as string[],
      skipped: [] as { slug: string; reason: string }[],
      failed: [] as { slug: string; reason: string }[],
      would_migrate: [] as string[],
    };

    const fs = require('fs');
    const path = require('path');

    for (const article of research) {
      const slug = article.slug;
      let pdfUrl = article.pdf;

      if (!pdfUrl) {
        report.skipped.push({ slug, reason: 'no_pdf' });
        continue;
      }

      if (isCloudinaryUrl(pdfUrl)) {
        report.skipped.push({ slug, reason: 'already_cloudinary' });
        continue;
      }

      // Handle local files (absolute path starting with '/' or relative paths)
      try {
        if (pdfUrl.startsWith('/') || !/^https?:\/\//i.test(pdfUrl)) {
          // Resolve to public/ folder on disk
          const relative = pdfUrl.replace(/^\/+/, '');
          const publicPath = path.join(process.cwd(), 'public', relative);

          if (fs.existsSync(publicPath)) {
            const fileBuf = fs.readFileSync(publicPath);
            const header = fileBuf && fileBuf.length >= 4 ? Buffer.from(fileBuf.slice(0, 4)).toString('utf8') : null;
            if (header !== '%PDF') {
              report.failed.push({ slug, reason: 'not_pdf_local' });
              continue;
            }

            // Upload local file to Cloudinary
            const base64 = Buffer.from(fileBuf).toString('base64');
            const dataUri = `data:application/pdf;base64,${base64}`;

            const uploadResult = await cloudinary.uploader.upload(dataUri, {
              folder: 'tcc/research',
              resource_type: 'raw',
              public_id: `${Date.now()}-${slug}`,
              use_filename: false,
              unique_filename: true,
            });

            article.pdf = uploadResult.secure_url;
            (article as any).pdf_cloudinary_id = uploadResult.public_id;
            report.migrated.push(slug);
            continue; // processed local file
          }

          // If not found on disk, try to resolve against site origin (if configured) so fetch can proceed
          const siteOrigin = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || null;
          if (siteOrigin) {
            try {
              pdfUrl = new URL(pdfUrl, siteOrigin).toString();
            } catch (e) {
              report.failed.push({ slug, reason: `failed_to_resolve_relative:${String(e)}` });
              continue;
            }
          } else {
            report.failed.push({ slug, reason: 'file_not_found' });
            continue;
          }
        }

        // Fetch first chunk to validate PDF magic
        const res = await fetch(pdfUrl, { method: 'GET' });
        if (!res.ok) {
          report.failed.push({ slug, reason: `fetch_failed:${res.status}` });
          continue;
        }

        // Read a small portion to verify PDF signature
        const reader = res.body?.getReader();
        let firstChunk: Uint8Array | null = null;
        if (reader) {
          const { value } = await reader.read();
          if (value) firstChunk = value;
        } else {
          const buff = await res.arrayBuffer();
          firstChunk = new Uint8Array(buff.slice(0, 1024));
        }

        // Validate PDF magic
        const header = firstChunk && firstChunk.length >= 4 ? Buffer.from(firstChunk.slice(0, 4)).toString('utf8') : null;
        if (header !== '%PDF') {
          report.failed.push({ slug, reason: 'not_pdf' });
          continue;
        }

        if (dryMode) {
          report.would_migrate.push(slug);
          continue; // in dry mode we don't upload or modify
        }

        // From here, perform full read and upload
        // Read remaining stream fully
        let fullBuffer: Uint8Array | null = null;
        if (reader) {
          const chunks = [] as Uint8Array[];
          if (firstChunk) chunks.push(firstChunk);
          while (true) {
            const r = await reader.read();
            if (r.done) break;
            if (r.value) chunks.push(r.value);
          }
          const totalLength = chunks.reduce((s, c) => s + c.length, 0);
          fullBuffer = new Uint8Array(totalLength);
          let off = 0;
          for (const c of chunks) {
            fullBuffer.set(c, off);
            off += c.length;
          }
        } else {
          const buff = await res.arrayBuffer();
          fullBuffer = new Uint8Array(buff);
        }

        const base64 = Buffer.from(fullBuffer!).toString('base64');
        const dataUri = `data:application/pdf;base64,${base64}`;

        // Upload to Cloudinary as raw
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: 'tcc/research',
          resource_type: 'raw',
          public_id: `${Date.now()}-${slug}`,
          use_filename: false,
          unique_filename: true,
        });

        // Update article pdf URL and metadata
        article.pdf = uploadResult.secure_url;
        (article as any).pdf_cloudinary_id = uploadResult.public_id;

        // Record migrated
        report.migrated.push(slug);
      } catch (err: any) {
        console.error(`Migration failed for ${slug}:`, err?.message || err);
        report.failed.push({ slug, reason: err?.message || 'unknown' });
      }
    }

    // Persist updated research only if not dry
    if (!dryMode) await redis.set(REDIS_KEY, JSON.stringify(research));

    return NextResponse.json({ success: true, report, total: research.length, dry: dryMode });
  } catch (error) {
    console.error('Error in migrate-pdfs:', error);
    return NextResponse.json({ error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
