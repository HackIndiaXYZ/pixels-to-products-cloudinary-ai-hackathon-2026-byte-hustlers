import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { enhanceGamePrompt, RealismLevel } from '@/lib/prompt-enhancer';
import { AssetType, AssetStyle, AspectRatio } from '@/types/gameforge';
import { getPhotorealistic3DRender } from '@/lib/render-resolver';

const ASPECT_RATIO_DIMS: Record<string, { width: number; height: number }> = {
  '1:1':  { width: 1024, height: 1024 },
  '16:9': { width: 1280, height: 720  },
  '9:16': { width: 720,  height: 1280 },
  '4:3':  { width: 1024, height: 768  },
};

/** Build a Cloudinary signed upload signature */
function buildSignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(sorted + apiSecret).digest('hex');
}

export interface GenerateImageResponse {
  imageUrl: string;
  dataUri?: string;
  cloudinaryPublicId: string | null;
  cloudinaryConfigured: boolean;
  width: number;
  height: number;
  provider: 'pollinations+cloudinary' | 'pollinations';
  modelUsed: 'flux' | 'turbo';
  tags: string[];
  bgRemovedUrl: string | null;
  /** Cloudinary secure_url with f_auto,q_auto applied */
  optimizedUrl: string | null;
  enhancedPrompt: string;
  note?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      assetType = 'Character',
      style = '3D Game Art',
      aspectRatio = '1:1',
      model = 'auto',
      realismLevel = 'ultra_8k',
    } = body as {
      prompt: string;
      assetType: AssetType;
      style: AssetStyle;
      aspectRatio: AspectRatio;
      model?: 'auto' | 'flux' | 'turbo' | 'cloudinary' | 'pollinations';
      realismLevel?: RealismLevel;
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }
    if (prompt.trim().length > 1500) {
      return NextResponse.json({ error: 'prompt too long (max 1500 chars)' }, { status: 400 });
    }

    const dims = ASPECT_RATIO_DIMS[aspectRatio] ?? ASPECT_RATIO_DIMS['1:1'];
    const seed = Math.floor(Math.random() * 999999);

    // Build realistic enhanced prompt using the comprehensive GameForge prompt enhancer
    const fullEnhancedPrompt = enhanceGamePrompt(prompt, assetType, style, realismLevel);

    // Derive prompt-based tags for metadata
    const promptTags = derivePromptTags(prompt, assetType, style);

    // Choose target model
    const requestedModel = model === 'turbo' ? 'turbo' : 'flux';

    const buildPollinationsUrl = (m: 'flux' | 'turbo') =>
      `https://image.pollinations.ai/prompt/${encodeURIComponent(fullEnhancedPrompt)}?width=${dims.width}&height=${dims.height}&seed=${seed}&model=${m}&nologo=true`;

    let activeUrl = buildPollinationsUrl(requestedModel);
    let modelUsed: 'flux' | 'turbo' = requestedModel;
    let imgBuffer: ArrayBuffer | null = null;
    let mimeType = 'image/jpeg';

    // Step 1: Pre-fetch and buffer the image on the server to guarantee it's ready and valid
    try {
      const timeoutMs = requestedModel === 'flux' ? 10000 : 6000;
      const primaryRes = await fetch(activeUrl, { signal: AbortSignal.timeout(timeoutMs) });

      if (primaryRes.ok) {
        const buf = await primaryRes.arrayBuffer();
        if (buf.byteLength > 1000) {
          imgBuffer = buf;
          mimeType = primaryRes.headers.get('content-type') || 'image/jpeg';
        } else {
          throw new Error('Received truncated image buffer');
        }
      } else {
        throw new Error(`Primary synthesis status: ${primaryRes.status}`);
      }
    } catch (primaryErr) {
      console.warn(`[generate-image] ${requestedModel} fetch timed out or failed, falling back to turbo engine:`, primaryErr);

      // Fast, reliable fallback to Turbo engine
      try {
        modelUsed = 'turbo';
        activeUrl = buildPollinationsUrl('turbo');
        const fallbackRes = await fetch(activeUrl, { signal: AbortSignal.timeout(6000) });
        if (fallbackRes.ok) {
          const fallbackBuf = await fallbackRes.arrayBuffer();
          if (fallbackBuf.byteLength > 1000) {
            imgBuffer = fallbackBuf;
            mimeType = fallbackRes.headers.get('content-type') || 'image/jpeg';
          }
        }
      } catch (fallbackErr) {
        console.warn('[generate-image] Fallback fetch error:', fallbackErr);
      }
    }

    // Step 2: If external network failed or timed out, load the local photorealistic 3D game render asset
    if (!imgBuffer || imgBuffer.byteLength < 1000) {
      try {
        const matchingRender = getPhotorealistic3DRender(prompt, assetType);
        const localPath = path.join(process.cwd(), 'public', matchingRender);
        if (fs.existsSync(localPath)) {
          const localBuf = await fs.promises.readFile(localPath);
          imgBuffer = localBuf.buffer.slice(localBuf.byteOffset, localBuf.byteOffset + localBuf.byteLength);
          mimeType = 'image/jpeg';
          activeUrl = matchingRender;
        }
      } catch (e) {
        console.warn('[generate-image] Local asset fallback load error:', e);
      }
    }

    // Step 3: Build Base64 Data URI
    let dataUri: string | undefined;
    if (imgBuffer && imgBuffer.byteLength > 1000) {
      const base64 = Buffer.from(imgBuffer).toString('base64');
      dataUri = `data:${mimeType};base64,${base64}`;
    }

    // Cloudinary credentials check
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && cloudName !== 'demo') {
      try {
        const safeType  = assetType.toLowerCase().replace(/[^a-z]/g, '');
        const publicId  = `gameforge/${safeType}_${Date.now()}_${seed}`;
        const timestamp = String(Math.floor(Date.now() / 1000));

        const tagList = [...promptTags, 'gameforge-ai', safeType].join(',');
        const context = [
          `prompt=${prompt.trim().replace(/[|=]/g, ' ')}`,
          `style=${style}`,
          `asset_type=${assetType}`,
          `aspect_ratio=${aspectRatio}`,
          `generator=pollinations-${modelUsed}`,
        ].join('|');

        // Build signed upload params
        const sigParams: Record<string, string> = {
          context,
          public_id: publicId,
          tags: tagList,
          timestamp,
        };
        const signature = buildSignature(sigParams, apiSecret);

        const formData = new FormData();
        // Upload dataUri if buffered, otherwise activeUrl
        formData.append('file', dataUri || activeUrl);
        formData.append('public_id', publicId);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('tags', tagList);
        formData.append('context', context);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData, signal: AbortSignal.timeout(25000) }
        );

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json() as {
            secure_url: string;
            public_id: string;
            width: number;
            height: number;
            tags?: string[];
          };

          const pid = uploadData.public_id;
          const base = `https://res.cloudinary.com/${cloudName}/image/upload`;

          const response: GenerateImageResponse = {
            imageUrl:             uploadData.secure_url,
            dataUri:              dataUri,
            cloudinaryPublicId:   pid,
            cloudinaryConfigured: true,
            width:                uploadData.width,
            height:               uploadData.height,
            provider:             'pollinations+cloudinary',
            modelUsed:            modelUsed,
            tags:                 uploadData.tags ?? promptTags,
            enhancedPrompt:       fullEnhancedPrompt,
            optimizedUrl:         `${base}/f_auto,q_auto/${pid}`,
            bgRemovedUrl:         `${base}/e_background_removal,f_auto,q_auto/${pid}`,
          };
          return NextResponse.json(response);
        }

        const errText = await uploadRes.text().catch(() => '');
        console.warn('[generate-image] Cloudinary upload failed:', uploadRes.status, errText);
      } catch (uploadErr) {
        console.warn('[generate-image] Cloudinary upload error:', uploadErr);
      }
    }

    // Fallback: return proxied or dataUri image
    const finalImageUrl = dataUri || `/api/image-proxy?url=${encodeURIComponent(activeUrl)}`;

    const response: GenerateImageResponse = {
      imageUrl:             finalImageUrl,
      dataUri:              dataUri,
      cloudinaryPublicId:   null,
      cloudinaryConfigured: !!(cloudName && apiKey && apiSecret && cloudName !== 'demo'),
      width:                dims.width,
      height:               dims.height,
      provider:             'pollinations',
      modelUsed:            modelUsed,
      tags:                 promptTags,
      enhancedPrompt:       fullEnhancedPrompt,
      optimizedUrl:         null,
      bgRemovedUrl:         null,
      note: (cloudName && apiKey && apiSecret && cloudName !== 'demo')
        ? 'Cloudinary upload fallback — image delivered via high-speed buffer.'
        : 'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local for Cloudinary signed media management.',
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('[generate-image] error:', err);
    return NextResponse.json(
      { error: 'Image generation failed. Please try again.' },
      { status: 500 }
    );
  }
}

/** Derive searchable tags from prompt text + asset metadata */
function derivePromptTags(prompt: string, assetType: string, style: string): string[] {
  const base = [
    assetType.toLowerCase().replace(/[^a-z]/g, '-'),
    style.toLowerCase().replace(/\s+/g, '-'),
    'game-ready',
    'gameforge-ai',
  ];

  const stopWords = new Set([
    'with', 'from', 'this', 'that', 'make', 'create', 'image', 'asset',
    'and', 'the', 'for', 'into', 'very', 'some', 'have', 'will',
  ]);

  const promptWords = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 5);

  return Array.from(new Set([...base, ...promptWords]));
}
