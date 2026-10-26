import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as posts from '../lib/post-tools.ts';
import * as exports from '../lib/export.ts';
import {estimateEarnings} from '../lib/utils.ts';
const sample=[{title:'B',views:100,likes:5,comments:3,shares:2,watchTime:3600,estimatedEarnings:2,engagementRate:10},{title:'A',views:300,likes:6,comments:3,shares:6,watchTime:7200,estimatedEarnings:4,engagementRate:5}];
test('overview totals derive from displayed metric inputs', () => { const data=posts.summarizePosts(sample); assert.equal(data.totalViews,400); assert.equal(data.engagementRate,6.25); assert.equal(data.watchTimeHours,3); assert.equal(data.estimatedRevenue,6); assert.equal(posts.summarizePosts([]).engagementRate,0); });
test('post ranking is stable and never mutates source arrays', () => { assert.equal(posts.sortPosts(sample)[0].title,'A'); assert.equal(sample[0].title,'B'); const tied=[{...sample[0]},{...sample[0],title:'second'}]; assert.equal(posts.sortPosts(tied)[1].title,'second'); });
