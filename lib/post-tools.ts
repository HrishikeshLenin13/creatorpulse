type SummaryPost = {views:number;likes:number;comments:number;shares:number;watchTime?:number;estimatedEarnings?:number};
const finite = (value:number|undefined) => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
/** Demo watchTime is total watched seconds, not an official provider field. */
export function summarizePosts(posts: readonly SummaryPost[]) {
  let views=0,interactions=0,watchSeconds=0,earnings=0;
  for(const post of posts) { views+=finite(post.views);interactions+=finite(post.likes)+finite(post.comments)+finite(post.shares);watchSeconds+=finite(post.watchTime);earnings+=finite(post.estimatedEarnings); }
  return {totalViews:views,totalPosts:posts.length,engagementRate:views ? interactions/views*100 : 0,watchTimeHours:watchSeconds/3600,estimatedRevenue:earnings};
}

export type PostSortKey = 'views' | 'engagementRate' | 'estimatedEarnings';
export function sortPosts<T extends {views:number;engagementRate:number;estimatedEarnings:number}>(posts:readonly T[], key:PostSortKey='views'):T[] {
  return posts.map((post,index)=>({post,index})).sort((a,b)=>finite(b.post[key])-finite(a.post[key]) || a.index-b.index).map(entry=>entry.post);
}
