# Consistent demo dashboard views and exports

This guide covers implemented behavior. It does not change deployment or account configuration.

## Usage

```ts
import {filterPosts, sortPosts, summarizePosts} from './lib/post-tools';
import {exportPostsJson} from './lib/export';
// posts is the app's demo post list.
const visible = sortPosts(filterPosts(posts, 'tutorial'), 'views');
console.log(summarizePosts(visible));
const json = exportPostsJson(visible);
```

## Contracts and limits

- Search matches trimmed, case-insensitive title text. Sorting uses views, engagement, or illustrative earnings with stable ordering for ties.
- Overview cards derive from the currently visible rows. Engagement is total interactions / total views, not an unweighted average of post percentages.
- Demo watchTime is total watched seconds and is converted to hours. Earnings remain illustrative estimates, not provider payouts.
- CSV and JSON exports use the same filtered/sorted rows as the table. JSON explicitly labels its source as demo and exports only known metric fields.

## Source map

- [`lib/post-tools.ts`](../lib/post-tools.ts)
<!-- source: lib/post-tools.ts -->
- [`lib/export.ts`](../lib/export.ts)
<!-- source: lib/export.ts -->
- [`lib/utils.ts`](../lib/utils.ts)
<!-- source: lib/utils.ts -->
- [`components/AnalyticsDashboard.tsx`](../components/AnalyticsDashboard.tsx)
<!-- source: components/AnalyticsDashboard.tsx -->
- [`tests/posts-round2.test.mjs`](../tests/posts-round2.test.mjs)
<!-- source: tests/posts-round2.test.mjs -->

## Regression command

Run from the repository root:

```sh
npm test && npm run typecheck
```


## Dashboard list controls

Sort direction and minimum views apply to the same visible list used for cards and CSV/JSON exports. Title searches match all normalized terms regardless of order, case, or accents. Clear filters resets the query and view threshold while preserving sort preferences. Number/currency formatters are reused across cells; overflowing positive aggregates saturate at the largest finite number rather than rendering Infinity. All data remains labeled demo.
