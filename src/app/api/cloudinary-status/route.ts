import { NextResponse } from 'next/server';

/**
 * Cloudinary Configuration Status Route
 *
 * Returns whether Cloudinary credentials are configured in the environment.
 * Does NOT expose credential values — only presence/absence.
 *
 * GET /api/cloudinary-status
 * Returns: { configured: boolean, cloudName: string | null }
 */
export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? null;
  const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
  const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
  const configured = !!(cloudName && hasApiKey && hasApiSecret && cloudName !== 'demo');

  return NextResponse.json({
    configured,
    cloudName: cloudName || 'demo',
    hasApiKey,
    hasApiSecret,
    features: {
      upload: configured,
      backgroundRemoval: configured,
      smartCrop: configured,
      aiVisionTags: configured,
      generativeReplace: configured,
      fAutoQAuto: configured,
    },
    setupInstructions: configured
      ? null
      : 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local to enable real Cloudinary media pipeline transformations and storage.',
  });
}
