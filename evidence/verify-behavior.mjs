// Deterministic same-input comparison; the injected upstream response is a test fixture.
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const root = process.argv[2];
const { fetchAnalyticsSnapshot } = await import(
  pathToFileURL(resolve(root, "lib/analytics.ts")).href
);
const result = await fetchAnalyticsSnapshot(
  "https://www.tiktok.com/@scout2015/video/6718335390845095173",
  {
    fetcher: async () =>
      new Response(
        JSON.stringify({
          title: "Fixture caption",
          author_name: "Fixture creator",
        }),
      ),
  },
);
if ("summary" in result)
  console.log(
    `MOCK provider=${result.provider} views=${result.summary.totalViews} title=${result.posts[0].title}`,
  );
else
  console.log(
    `REAL source=${result.source} views=${result.metrics.views} title=${result.title}`,
  );
