import { NextRequest, NextResponse } from 'next/server';
import { generateGameAssetSvg } from '@/lib/asset-renderer';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id') || undefined;
  const prompt = searchParams.get('prompt') || undefined;
  const name = searchParams.get('name') || undefined;
  const assetType = searchParams.get('assetType') || undefined;
  const style = searchParams.get('style') || undefined;

  const svgString = generateGameAssetSvg({ id, prompt, name, assetType, style });

  return new NextResponse(svgString, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
