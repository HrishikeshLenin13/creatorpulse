import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as posts from '../lib/post-tools.ts';
import * as exports from '../lib/export.ts';
import {estimateEarnings} from '../lib/utils.ts';
const sample=[{title:'B',views:100,likes:5,comments:3,shares:2,watchTime:3600,estimatedEarnings:2,engagementRate:10},{title:'A',views:300,likes:6,comments:3,shares:6,watchTime:7200,estimatedEarnings:4,engagementRate:5}];
test('overview totals derive from displayed metric inputs', () => { const data=posts.summarizePosts(sample); assert.equal(data.totalViews,400); assert.equal(data.engagementRate,6.25); assert.equal(data.watchTimeHours,3); assert.equal(data.estimatedRevenue,6); assert.equal(posts.summarizePosts([]).engagementRate,0); });
test('post ranking is stable and never mutates source arrays', () => { assert.equal(posts.sortPosts(sample)[0].title,'A'); assert.equal(sample[0].title,'B'); const tied=[{...sample[0]},{...sample[0],title:'second'}]; assert.equal(posts.sortPosts(tied)[1].title,'second'); });
test('search handles case and whitespace without altering posts', () => { assert.equal(posts.filterPosts(sample,' a ')[0].title,'A'); assert.equal(posts.filterPosts(sample,'missing').length,0); assert.equal(posts.filterPosts(sample,'').length,2); });
test('illustrative earnings remain finite for malformed inputs', () => { for(const value of [-1,NaN,Infinity]) {assert.equal(estimateEarnings(value,10),0);assert.equal(estimateEarnings(100,value),0);} assert.equal(estimateEarnings(1000,0),2.3); });
test('JSON export includes only metric fields and demo attribution', () => { const data=JSON.parse(exports.exportPostsJson([{...sample[0],privateField:'hidden'}])); assert.equal(data.source,'demo'); assert.ok(!JSON.stringify(data).includes('hidden')); });

test('generated list pipelines keep summary totals, stable order and exports aligned', () => {
  const original=Array.from({length:100},(_,i)=>({...sample[i%2],title:`${i%2 ? 'Tutorial' : 'Demo'} ${i}`,views:i*100,likes:i,estimatedEarnings:i%7}));
  const before=JSON.stringify(original);
  for(const query of ['', 'tutorial', 'missing']) for(const key of ['views','engagementRate','estimatedEarnings']) {
    const selected=posts.sortPosts(posts.filterPosts(original,query),key);
    const expectedViews=selected.reduce((sum,post)=>sum+post.views,0);
    assert.equal(posts.summarizePosts(selected).totalViews,expectedViews);
    assert.deepEqual(posts.summarizePosts([...selected].reverse()),posts.summarizePosts(selected));
    assert.deepEqual(JSON.parse(exports.exportPostsJson(selected)).posts.map(p=>p.title),selected.map(p=>p.title));
    assert.equal(exports.exportPostsCsv(selected).split('\r\n').length,selected.length+2);
    for(let i=1;i<selected.length;i++) assert.ok(selected[i-1][key]>=selected[i][key]);
  }
  assert.equal(JSON.stringify(original),before);
});

import {readFileSync} from 'node:fs';
test('root layout loads the shared theme on direct dashboard visits', () => {
  const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');
  assert.match(layout,/import ['"]\.\/globals\.css['"]/);
});
