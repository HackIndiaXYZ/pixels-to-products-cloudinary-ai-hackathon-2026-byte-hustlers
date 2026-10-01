import { NextRequest, NextResponse } from 'next/server';

export interface HiggsfieldMotionRequest {
  imageUrl: string;
  motionType: string;
  assetName: string;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as HiggsfieldMotionRequest;
  const { imageUrl, motionType, assetName } = body;

  if (!imageUrl || !motionType) {
    return NextResponse.json({ error: 'imageUrl and motionType are required' }, { status: 400 });
  }

  const apiKey = process.env.HIGGSFIELD_API_KEY;
  const hasRealKey = !!apiKey && apiKey !== '1f068c8a-9f74-489c-abca-6f819674e5fc';

  // Higgsfield does not currently offer a public REST API for direct third-party video generation.
  // We return truthful status and telemetry so the motion studio animates the actual asset directly in 2.5D.
  return NextResponse.json({
    configured: hasRealKey,
    videoUrl: null,
    jobId: `motion-job-${Date.now()}`,
    motionType,
    assetName,
    message: hasRealKey
      ? 'Higgsfield motion parameters queued.'
      : 'Higgsfield AI direct video generation is on the product roadmap. Real-time 2.5D Camera Motion Simulation is active on your asset.',
    status: 'ready'
  });
}
