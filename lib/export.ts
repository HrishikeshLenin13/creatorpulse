export type ExportPost = {
  title: string; views: number; likes: number; comments: number;
  shares: number; engagementRate: number;
};

function csvCell(value: string | number): string {
  const text = String(value);
  // Prefix formula-like text, including leading control/whitespace characters.
  const escaped = typeof value === 'string' && (/^\s*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) ? "'" + text : text;
  return `"${escaped.replace(/"/g, '""')}"`;
}

/** Export the displayed sample rows, not a fabricated live-data report. */
export function exportPostsCsv(posts: ExportPost[]): string {
  const header = ['Title', 'Views', 'Likes', 'Comments', 'Shares', 'Engagement (%)', 'Source'];
  const rows = posts.map(post => [post.title, post.views, post.likes, post.comments,
    post.shares, post.engagementRate, 'Demo data']);
  return [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

export function exportPostsJson(posts: ExportPost[]): string {
  return JSON.stringify({schemaVersion:1,source:'demo',posts:posts.map(post=>({title:post.title,views:post.views,likes:post.likes,comments:post.comments,shares:post.shares,engagementRate:post.engagementRate}))},null,2)+'\n';
}
