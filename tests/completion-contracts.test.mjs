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

test("sort-does-not-reuse-the-input-array", () => {
const a=[post];assert.notEqual(api.sortPosts(a),a);assert.deepEqual(api.sortPosts(a),a);
});

test("search-matches-case-insensitively", () => {
assert.equal(api.filterPosts([post],'CREATOR').length,1);
});

test("search-matches-terms-regardless-of-order", () => {
assert.equal(api.filterPosts([post],'gear creator').length,1);
});

test("search-requires-every-nonempty-term", () => {
assert.equal(api.filterPosts([post],'creator absent').length,0);
});

test("search-trims-and-collapses-query-whitespace", () => {
assert.equal(api.filterPosts([post],'  creator   gear ').length,1);
});

test("search-normalizes-composed-and-decomposed-accents", () => {
assert.equal(api.filterPosts([{...post,title:'Café'}],'Cafe\u0301').length,1);
});

test("empty-search-retains-all-posts-in-source-order", () => {
const rows=[post,{...post,title:'b'}];assert.deepEqual(api.filterPosts(rows,' '),rows);assert.notEqual(api.filterPosts(rows,''),rows);
});

test("view-threshold-includes-exact-boundary", () => {
assert.equal(api.filterPostsByViews([post],100).length,1);assert.equal(api.filterPostsByViews([post],101).length,0);
});

test("view-threshold-does-not-mutate-input-posts", () => {
const rows=[post];api.filterPostsByViews(rows,999);assert.equal(rows.length,1);
});

test("view-threshold-rejects-negative", () => {
assert.throws(()=>api.filterPostsByViews([post],-1),RangeError);
});

test("view-threshold-rejects-nan", () => {
assert.throws(()=>api.filterPostsByViews([post],NaN),RangeError);
});

test("view-threshold-rejects-infinite", () => {
assert.throws(()=>api.filterPostsByViews([post],Infinity),RangeError);
});

test("empty-json-export-keeps-demo-attribution", () => {
const r=JSON.parse(out.exportPostsJson([]));assert.equal(r.source,'demo');assert.deepEqual(r.posts,[]);assert.equal(r.schemaVersion,1);
});

test("json-export-allowlists-post-fields", () => {
assert.ok(!out.exportPostsJson([{...post,password:'hidden'}]).includes('hidden'));
});

test("json-export-preserves-visible-order", () => {
assert.deepEqual(JSON.parse(out.exportPostsJson([{...post,title:'z'},post])).posts.map(p=>p.title),['z',post.title]);
});

test("csv-escapes-quoted-post-titles", () => {
assert.ok(out.exportPostsCsv([{...post,title:'A "quote"'}]).includes('A ""quote""'));
});

test("csv-quotes-multiline-post-titles", () => {
assert.ok(out.exportPostsCsv([{...post,title:'A\nB'}]).includes('"A\nB"'));
});

test("csv-neutralizes-equals-titles", () => {
assert.ok(out.exportPostsCsv([{...post,title:"=SUM(A1)"}]).includes("'"+"=SUM(A1)"));
});

test("csv-neutralizes-leading-space-titles", () => {
assert.ok(out.exportPostsCsv([{...post,title:"  +1"}]).includes("'"+"  +1"));
});

test("csv-neutralizes-at-titles", () => {
assert.ok(out.exportPostsCsv([{...post,title:"@cmd"}]).includes("'"+"@cmd"));
});
