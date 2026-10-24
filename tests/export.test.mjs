import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportPostsCsv } from '../lib/export.ts';

test('CSV exports displayed metrics and quotes titles', () => {
  const csv = exportPostsCsv([{title:'A, "B"\nC', views:10, likes:2, comments:1, shares:0, engagementRate:30}]);
  assert.ok(csv.includes('"A, ""B""\nC",10'.replace(',10', ',"10"')));
  assert.ok(csv.includes('"Demo data"'));
  assert.equal(exportPostsCsv([]).split('\r\n').length, 2);
});

test('formula-like titles stay text when opened in spreadsheets', () => {
  for (const title of ['=1+1', '+SUM(A1)', '-2+4', '@SUM(A1)', '  =1', '\tvalue']) {
    const csv = exportPostsCsv([{title, views:10, likes:2, comments:1, shares:0, engagementRate:30}]);
    assert.ok(csv.split('\r\n')[1].startsWith('"\''));
  }
});
