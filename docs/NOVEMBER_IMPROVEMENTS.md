# November implementation improvements

`summarizePostsByPlatform(visiblePosts)` groups only the supplied rows, normalizes platform labels, retains the existing finite-metric rules and returns deterministic platform summaries. Missing labels become `other`. No provider/account data is fetched and no dashboard UI changes are claimed.

`exportPlatformSummaryCsv(summarizePostsByPlatform(visiblePosts))` exports displayed aggregate metrics with formula-safe platform labels and an explicit demo-data source column. No live provider data or verified earnings are claimed.
