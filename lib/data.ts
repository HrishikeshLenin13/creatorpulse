export type VideoMetrics = {
  id: string;
  title: string;
  url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  avgWatchDuration: number;
  engagementRate: number;
  estimatedEarnings: number;
  trend: number[];
  lastUpdated: string;
};

export const mockVideoMetrics: VideoMetrics[] = [
  {
    id: '1',
    title: 'Day in the life of a creator',
    url: 'https://www.tiktok.com/@creator/video/1234567890',
    views: 128400,
    likes: 15200,
    comments: 480,
    shares: 990,
    watchTime: 42000,
    avgWatchDuration: 32.8,
    engagementRate: 12.4,
    estimatedEarnings: 286.5,
    trend: [42, 48, 57, 61, 74, 80, 88],
    lastUpdated: '2 mins ago',
  },
  {
    id: '2',
    title: '3 hacks for better content',
    url: 'https://www.tiktok.com/@creator/video/1234567891',
    views: 92600,
    likes: 11750,
    comments: 310,
    shares: 720,
    watchTime: 31200,
    avgWatchDuration: 28.1,
    engagementRate: 11.1,
    estimatedEarnings: 201.2,
    trend: [30, 35, 40, 52, 58, 62, 65],
    lastUpdated: '14 mins ago',
  },
  {
    id: '3',
    title: 'Creator gear setup tour',
    url: 'https://www.tiktok.com/@creator/video/1234567892',
    views: 74500,
    likes: 8930,
    comments: 251,
    shares: 510,
    watchTime: 26500,
    avgWatchDuration: 25.7,
    engagementRate: 10.8,
    estimatedEarnings: 164.5,
    trend: [22, 29, 34, 46, 48, 54, 59],
    lastUpdated: '31 mins ago',
  },
];
