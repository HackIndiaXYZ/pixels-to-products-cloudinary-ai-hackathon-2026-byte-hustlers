import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPhotorealistic3DRender } from '@/lib/render-resolver';

// In-memory memory cache for fast repeated requests
const memoryCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  const targetUrl = decodeURIComponent(urlParam);

  // Check in-memory cache
  const cached = memoryCache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return new NextResponse(new Uint8Array(cached.buffer), {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const res = await fetch(targetUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'GameForge-AI-AssetEngine/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      const contentType = res.headers.get('content-type') || 'image/jpeg';

      if (buffer.length > 500) {
        // Cache in memory
        memoryCache.set(targetUrl, { buffer, contentType, timestamp: Date.now() });

        // Keep memory cache size bounded
        if (memoryCache.size > 200) {
          const firstKey = memoryCache.keys().next().value;
          if (firstKey) memoryCache.delete(firstKey);
        }

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
  } catch (err) {
    console.warn('[image-proxy] Proxy fetch failed for URL:', targetUrl, err);
  }

  // Fallback: serve matching high-definition 3D game render directly from local disk
  try {
    const renderPath = getPhotorealistic3DRender(targetUrl);
    const localFilePath = path.join(process.cwd(), 'public', renderPath);
    if (fs.existsSync(localFilePath)) {
      const fileBuffer = await fs.promises.readFile(localFilePath);
      return new NextResponse(new Uint8Array(fileBuffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (localErr) {
    console.warn('[image-proxy] Local render load error:', localErr);
  }

  return NextResponse.redirect('/assets/renders/ironman.jpg', 307);
}
