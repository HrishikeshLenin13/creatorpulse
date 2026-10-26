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
export function sortPosts<T extends {views:number;engagementRate:number;estimatedEarnings:number}>(posts:readonly T[], key:PostSortKey='views', direction:'asc'|'desc'='desc'):T[] {
  if (direction !== 'asc' && direction !== 'desc') throw new RangeError('Use asc or desc sort order.');
  const sign = direction === 'asc' ? 1 : -1;
  return posts.map((post,index)=>({post,index})).sort((a,b)=>sign*(finite(a.post[key])-finite(b.post[key])) || a.index-b.index).map(entry=>entry.post);
}

export function filterPosts<T extends {title:string}>(posts:readonly T[], query:string):T[] {
  const normalize=(value:string)=>value.normalize('NFKD').replace(new RegExp('\\p{Mark}','gu'),'').toLowerCase();
  const needles=normalize(query).trim().split(/\s+/).filter(Boolean);
  return posts.filter(post=>{const title=normalize(post.title);return needles.every(needle=>title.includes(needle));});
}

export function filterPostsByViews<T extends {views:number}>(posts:readonly T[], minimum=0):T[] {
  if (!Number.isFinite(minimum) || minimum < 0) throw new RangeError('Minimum views must be finite and nonnegative.');
  return posts.filter(post=>finite(post.views)>=minimum);
}
