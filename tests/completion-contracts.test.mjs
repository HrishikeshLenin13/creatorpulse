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
