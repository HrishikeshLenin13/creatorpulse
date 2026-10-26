import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../lib/post-tools.ts';
import * as out from '../lib/export.ts';
import * as utils from '../lib/utils.ts';
const post={title:'Creator gear',views:100,likes:5,comments:2,shares:3,watchTime:3600,estimatedEarnings:2,engagementRate:10};

test("empty-post-list-has-explicit-zero-totals", () => {
const s=api.summarizePosts([]);assert.equal(s.totalPosts,0);assert.equal(s.totalViews,0);assert.equal(s.engagementRate,0);
});
