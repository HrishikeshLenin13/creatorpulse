export type ExportPost = {
  title: string; views: number; likes: number; comments: number;
  shares: number; engagementRate: number;
};

function csvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

/** Export the displayed sample rows, not a fabricated live-data report. */
export function exportPostsCsv(posts: ExportPost[]): string {
  const header = ['Title', 'Views', 'Likes', 'Comments', 'Shares', 'Engagement (%)', 'Source'];
  const rows = posts.map(post => [post.title, post.views, post.likes, post.comments,
    post.shares, post.engagementRate, 'Demo data']);
  return [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
