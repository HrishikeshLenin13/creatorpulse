export async function GET() {
  return Response.json({
    ok: true,
    service: 'CreatorPulse',
    version: '0.2.0',
    summary: {
      totalViews: 1235000,
      avgEngagement: 12.1,
      watchTimeHours: 42.6,
      estimatedRevenue: 4860,
      totalPosts: 3,
    },
    posts: [
      {
        id: '1',
        title: 'Day in the life of a creator',
        views: 128400,
        engagementRate: 12.4,
        estimatedEarnings: 286.5,
      },
      {
        id: '2',
        title: '3 hacks for better content',
        views: 92600,
        engagementRate: 11.1,
        estimatedEarnings: 201.2,
      },
      {
        id: '3',
        title: 'Creator gear setup tour',
        views: 74500,
        engagementRate: 10.8,
        estimatedEarnings: 164.5,
      },
    ],
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  const url = body.url ?? '';

  return Response.json({
    ok: true,
    url,
    summary: {
      totalViews: 128400,
      avgEngagement: 12.4,
      watchTimeHours: 32.8,
      estimatedRevenue: 286.5,
    },
    message: 'Metrics received successfully for the provided creator URL.',
  });
}
