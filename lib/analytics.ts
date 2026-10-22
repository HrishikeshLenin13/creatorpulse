export type CreatorProfile = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  region: string;
};

export type PostMetric = {
  id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  estimatedEarnings: number;
  category: string;
  trend: number[];
};

export type AnalyticsSummary = {
  totalViews: number;
  avgEngagement: number;
  watchTimeHours: number;
  estimatedRevenue: number;
  totalPosts: number;
};

export type AnalyticsResponse = {
  ok: boolean;
  provider: 'tiktok-mock' | 'tiktok-live' | 'tiktok-provider';
  sourceUrl: string;
  profile: CreatorProfile;
  summary: AnalyticsSummary;
  posts: PostMetric[];
  generatedAt: string;
};

export async function fetchAnalyticsSnapshot(url: string): Promise<AnalyticsResponse> {
  const normalized = url.trim();

  const profile: CreatorProfile = {
    id: 'creator_1042',
    name: 'Ava Chen',
    handle: '@ava.chengrowth',
    niche: 'Short-form storytelling',
    region: 'US',
  };

  const posts: PostMetric[] = [
    {
      id: 'p_1',
      title: 'Day in the life of a creator',
      views: 128400,
      likes: 15200,
      comments: 480,
      shares: 990,
      engagementRate: 12.4,
      estimatedEarnings: 286.5,
      category: 'Lifestyle',
      trend: [42, 48, 57, 61, 74, 80, 88],
    },
    {
      id: 'p_2',
      title: '3 hacks for better content',
      views: 92600,
      likes: 11750,
      comments: 310,
      shares: 720,
      engagementRate: 11.1,
      estimatedEarnings: 201.2,
      category: 'Growth',
      trend: [30, 35, 40, 52, 58, 62, 65],
    },
    {
      id: 'p_3',
      title: 'Creator gear setup tour',
      views: 74500,
      likes: 8930,
      comments: 251,
      shares: 510,
      engagementRate: 10.8,
      estimatedEarnings: 164.5,
      category: 'Equipment',
      trend: [22, 29, 34, 46, 48, 54, 59],
    },
  ];

  const summary: AnalyticsSummary = {
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    avgEngagement: Number((posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length).toFixed(1)),
    watchTimeHours: 42.6,
    estimatedRevenue: 4860,
    totalPosts: posts.length,
  };

  return {
    ok: true,
    provider: 'tiktok-provider',
    sourceUrl: normalized,
    profile,
    summary,
    posts,
    generatedAt: new Date().toISOString(),
  };
}
