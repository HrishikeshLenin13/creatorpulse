export async function GET() {
  return Response.json({
    ok: true,
    service: 'CreatorPulse',
    version: '0.2.0',
    metrics: {
      totalViews: 1200000,
      avgEngagement: 12.1,
      estimatedRevenue: 4860,
    },
  });
}
