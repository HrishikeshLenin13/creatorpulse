import { test } from "node:test";
import assert from "node:assert/strict";
import {
  engagementRate,
  interactionRate,
  estimateRevenue,
  relativeLift,
} from "../lib/metrics";
import { postsInWindow } from "../lib/data";
import { csvCell } from "../lib/export";
import { parseReports } from "../lib/report-store";
test("weighted engagement by views is calculated from aggregate counts", () => {
  assert.equal(
    engagementRate({ views: 1000, likes: 100, comments: 20, shares: 10 }),
    13,
  );
  assert.equal(
    interactionRate({ views: 1000, likes: 100, comments: 20, shares: null }),
    12,
  );
});
test("missing, zero and invalid denominators are not fabricated as engagement", () => {
  for (const views of [0, null, -1, Infinity, NaN])
    assert.equal(
      engagementRate({ views, likes: 100, comments: 20, shares: 10 }),
      null,
    );
  assert.equal(
    engagementRate({ views: 1000, likes: 100, comments: 20, shares: null }),
    null,
  );
  assert.equal(
    engagementRate({ views: 1000, likes: 0, comments: 0, shares: 0 }),
    0,
  );
});
test("revenue scenarios use eligible views per thousand and explicit RPM assumptions", () => {
  assert.deepEqual(estimateRevenue(100000, 0.4, 1), [40, 100]);
  assert.deepEqual(estimateRevenue(0, 0.4, 1), [0, 0]);
  for (const args of [
    [100, -1, 1],
    [100, 2, 1],
    [NaN, 0, 1],
    [100, 0, Infinity],
  ])
    assert.throws(() => estimateRevenue(args[0], args[1], args[2]));
});
test("relative lift handles absent baseline", () => {
  assert.equal(relativeLift(200, 100), 100);
  assert.equal(relativeLift(1, 0), null);
});
test("sample date filters use explicit UTC reference, not an arbitrary current clock", () => {
  assert.equal(postsInWindow(7).length, 3);
  assert.equal(postsInWindow(30).length, 6);
  assert.equal(postsInWindow(90).length, 8);
});
test("CSV escapes quotes and neutralizes formula-leading cells", () => {
  assert.equal(csvCell('a"b'), '"a""b"');
  assert.equal(csvCell('=HYPERLINK("evil")'), '"\'=HYPERLINK(""evil"")"');
});
test("corrupted browser history never crashes or loads untrusted URLs", () => {
  assert.deepEqual(parseReports("{"), []);
  assert.deepEqual(parseReports("{}"), []);
  assert.deepEqual(parseReports('[{"url":"javascript:alert(1)"}]'), []);
});
