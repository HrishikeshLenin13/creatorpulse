import { NextRequest, NextResponse } from 'next/server';
import { fetchAnalyticsSnapshot } from '@/lib/analytics';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'CreatorPulse analytics',
    version: '1.0.0',
    status: 'healthy',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body as { url?: string };

    if (!url || typeof url !== 'string' || !url.includes('tiktok.com')) {
      return NextResponse.json(
        { ok: false, message: 'Invalid TikTok URL provided.' },
        { status: 400 },
      );
    }

    const snapshot = await fetchAnalyticsSnapshot(url);

    return NextResponse.json({
      ok: true,
      ...snapshot,
      message: 'TikTok analytics snapshot generated successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to analyze content.',
      },
      { status: 500 },
    );
  }
}
