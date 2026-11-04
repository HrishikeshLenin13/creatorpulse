import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizePostsByPlatform} from '../lib/post-tools.ts';
test('platform summaries merge normalized labels and preserve visible input',()=>{
 const row={views:100,likes:5,comments:2,shares:3};const input=[{...row,platform:' YouTube '},{...row,platform:'youtube'},{...row},{...row,platform:'__proto__'}];const before=JSON.stringify(input);const result=summarizePostsByPlatform(input);
 assert.deepEqual(result.map(x=>x.platform),['__proto__','other','youtube']);assert.equal(result[2].totalViews,200);assert.equal(result[2].totalPosts,2);assert.equal(result[2].engagementRate,10);assert.equal(JSON.stringify(input),before);assert.deepEqual(summarizePostsByPlatform([]),[]);
});
