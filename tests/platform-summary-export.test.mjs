import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exportPlatformSummaryCsv} from '../lib/export.ts';
import {summarizePostsByPlatform} from '../lib/post-tools.ts';
test('platform CSV uses visible aggregates and preserves demo provenance',()=>{
 const row={platform:'=sum',views:100,likes:1,comments:2,shares:3,watchTime:3600};const groups=summarizePostsByPlatform([row,row]);const before=JSON.stringify(groups);const csv=exportPlatformSummaryCsv(groups);assert.ok(csv.includes(`"'=sum","2","200","6","2","0","Demo data"`));assert.equal(JSON.stringify(groups),before);assert.equal(exportPlatformSummaryCsv([]).split('\r\n').length,2);
});
