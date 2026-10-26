type SummaryPost = {views:number;likes:number;comments:number;shares:number;watchTime?:number;estimatedEarnings?:number};
const addFinite = (a:number,b:number) => Math.min(Number.MAX_VALUE,a+b);
const finite = (value:number|undefined) => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
/** Demo watchTime is total watched seconds, not an official provider field. */
export function summarizePosts(posts: readonly SummaryPost[]) {
  let views=0,interactions=0,watchSeconds=0,earnings=0;
  for(const post of posts) { views=addFinite(views,finite(post.views));interactions=addFinite(interactions,addFinite(finite(post.likes),addFinite(finite(post.comments),finite(post.shares))));watchSeconds=addFinite(watchSeconds,finite(post.watchTime));earnings=addFinite(earnings,finite(post.estimatedEarnings)); }
  return {totalViews:views,totalPosts:posts.length,engagementRate:views ? Math.min(Number.MAX_VALUE,interactions/views*100) : 0,watchTimeHours:watchSeconds/3600,estimatedRevenue:earnings};
}

export type PostSortKey = 'views' | 'engagementRate' | 'estimatedEarnings';
export function sortPosts<T extends {views:number;engagementRate:number;estimatedEarnings:number}>(posts:readonly T[], key:PostSortKey='views'):T[] {
  return posts.map((post,index)=>({post,index})).sort((a,b)=>finite(b.post[key])-finite(a.post[key]) || a.index-b.index).map(entry=>entry.post);
}

export function filterPosts<T extends {title:string}>(posts:readonly T[], query:string):T[] {
  const needle=query.trim().toLocaleLowerCase();
  return posts.filter(post=>post.title.toLocaleLowerCase().includes(needle));
}
