import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../lib/post-tools.ts';
import * as out from '../lib/export.ts';
import * as utils from '../lib/utils.ts';
const post={title:'Creator gear',views:100,likes:5,comments:2,shares:3,watchTime:3600,estimatedEarnings:2,engagementRate:10};

test("empty-post-list-has-explicit-zero-totals", () => {
const s=api.summarizePosts([]);assert.equal(s.totalPosts,0);assert.equal(s.totalViews,0);assert.equal(s.engagementRate,0);
});

test("summary-ignores-negative-views", () => {
const r=api.summarizePosts([{...post,views:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("summary-ignores-negative-likes", () => {
const r=api.summarizePosts([{...post,likes:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("summary-ignores-negative-comments", () => {
const r=api.summarizePosts([{...post,comments:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("summary-ignores-negative-shares", () => {
const r=api.summarizePosts([{...post,shares:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("summary-ignores-negative-watchTime", () => {
const r=api.summarizePosts([{...post,watchTime:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("summary-ignores-negative-estimatedEarnings", () => {
const r=api.summarizePosts([{...post,estimatedEarnings:-1}]);assert.ok(Object.values(r).every(Number.isFinite));assert.ok(Object.values(r).every(v=>v>=0));
});

test("watch-time-seconds-convert-to-hours", () => {
assert.equal(api.summarizePosts([{...post,watchTime:7200}]).watchTimeHours,2);
});

test("engagement-is-weighted-by-views-not-post-count", () => {
const s=api.summarizePosts([{...post,views:100,likes:10,comments:0,shares:0},{...post,views:900,likes:0,comments:0,shares:0}]);assert.equal(s.engagementRate,1);
});

test("zero-view-totals-do-not-divide-by-zero", () => {
assert.equal(api.summarizePosts([{...post,views:0}]).engagementRate,0);
});

test("summary-saturates-overflowing-positive-sums", () => {
const s=api.summarizePosts([{...post,views:Number.MAX_VALUE},{...post,views:Number.MAX_VALUE}]);assert.equal(s.totalViews,Number.MAX_VALUE);
});

test("summary-does-not-mutate-metric-records", () => {
const p={...post},before=JSON.stringify(p);api.summarizePosts([p]);assert.equal(JSON.stringify(p),before);
});

test("sort-views-asc", () => {
const rows=[{...post,title:'one',views:2},{...post,title:'two',views:1}];const sorted=api.sortPosts(rows,'views','asc');assert.equal(sorted[0].title,'two');assert.equal(rows[0].title,'one');
});

test("sort-views-desc", () => {
const rows=[{...post,title:'one',views:2},{...post,title:'two',views:1}];const sorted=api.sortPosts(rows,'views','desc');assert.equal(sorted[0].title,'one');assert.equal(rows[0].title,'one');
});

test("sort-engagementRate-asc", () => {
const rows=[{...post,title:'one',engagementRate:2},{...post,title:'two',engagementRate:1}];const sorted=api.sortPosts(rows,'engagementRate','asc');assert.equal(sorted[0].title,'two');assert.equal(rows[0].title,'one');
});

test("sort-engagementRate-desc", () => {
const rows=[{...post,title:'one',engagementRate:2},{...post,title:'two',engagementRate:1}];const sorted=api.sortPosts(rows,'engagementRate','desc');assert.equal(sorted[0].title,'one');assert.equal(rows[0].title,'one');
});

test("sort-estimatedEarnings-asc", () => {
const rows=[{...post,title:'one',estimatedEarnings:2},{...post,title:'two',estimatedEarnings:1}];const sorted=api.sortPosts(rows,'estimatedEarnings','asc');assert.equal(sorted[0].title,'two');assert.equal(rows[0].title,'one');
});

test("sort-estimatedEarnings-desc", () => {
const rows=[{...post,title:'one',estimatedEarnings:2},{...post,title:'two',estimatedEarnings:1}];const sorted=api.sortPosts(rows,'estimatedEarnings','desc');assert.equal(sorted[0].title,'one');assert.equal(rows[0].title,'one');
});

test("tied-sort-keys-preserve-source-order", () => {
const a=[{...post,title:'a'},{...post,title:'b'}];assert.deepEqual(api.sortPosts(a).map(p=>p.title),['a','b']);
});

test("invalid-sort-direction-fails-explicitly", () => {
assert.throws(()=>api.sortPosts([post],'views','sideways'),RangeError);
});
