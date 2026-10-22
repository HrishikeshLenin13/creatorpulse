import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVideoUrl, AnalysisError } from "../lib/video-url";
import { analyzeVideo } from "../lib/providers/public-video";
const youtube = "https://www.youtube.com/watch?v=jNQXAC9IVRw";
const tiktok = "https://www.tiktok.com/@scout2015/video/6718335390845095173";
const metadata = {
  title: "A real provider title #test",
  author_name: "Creator",
  html: "<script>dangerous()</script>",
};
const respond = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status });
for (const url of [
  "https://youtu.be/jNQXAC9IVRw?si=tracking",
  "https://m.youtube.com/watch?v=jNQXAC9IVRw&t=2",
  "https://www.youtube.com/shorts/jNQXAC9IVRw",
  "https://www.youtube.com/embed/jNQXAC9IVRw",
  "https://www.youtube.com/live/jNQXAC9IVRw",
]) {
  test(`canonicalizes YouTube: ${url}`, () =>
    assert.equal(parseVideoUrl(url).url, youtube));
}
test("TikTok drops tracking", () =>
  assert.equal(parseVideoUrl(tiktok + "?utm_source=x#foo").url, tiktok));
for (const bad of [
  null,
  1,
  {},
  "",
  "javascript:alert(1)",
  "http://www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://127.0.0.1/video",
  "https://[::1]/",
  "https://169.254.169.254/latest/meta-data",
  "https://youtube.com.evil.test/watch?v=jNQXAC9IVRw",
  "https://evil.test/?q=tiktok.com",
  "https://user:pass@www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://www.youtube.com:444/watch?v=jNQXAC9IVRw",
  "https://www.tiktok.com/@creator",
  "https://www.youtube.com/watch?v=invalid",
  "https://vm.tiktok.com/a/b",
  "x".repeat(3000),
]) {
  test(`rejects malformed or non-provider input ${String(bad).slice(0, 65)}`, () =>
    assert.throws(() => parseVideoUrl(bad), AnalysisError));
}
test("returns real metadata with unavailable counts, never fictional statistics or provider HTML", async () => {
  const calls: string[] = [];
  const report = await analyzeVideo(youtube, {
    fetcher: async (input) => {
      calls.push(String(input));
      return respond(metadata);
    },
  });
  assert.equal(calls.length, 1);
  assert.ok(calls[0].startsWith("https://www.youtube.com/oembed?"));
  assert.equal(report.title, metadata.title);
  assert.equal(report.source, "public-oembed");
  assert.deepEqual(report.metrics, {
    views: null,
    likes: null,
    comments: null,
    shares: null,
  });
  assert.equal(report.interactionRate, null);
  assert.ok(!JSON.stringify(report).includes("<script>"));
  assert.match(report.observations[0], /1 hashtag/);
  assert.ok(report.limitations.some((t) => t.includes("YOUTUBE_API_KEY")));
});
test("TikTok uses official oEmbed", async () => {
  const report = await analyzeVideo(tiktok, {
    fetcher: async (input) => {
      assert.ok(String(input).startsWith("https://www.tiktok.com/oembed?"));
      return respond(metadata);
    },
  });
  assert.equal(report.platform, "tiktok");
  assert.equal(report.metrics.views, null);
});
test("YouTube API statistics use measured data and distinct interaction formula", async () => {
  const report = await analyzeVideo(youtube, {
    youtubeKey: "test-only-key",
    fetcher: async (input) =>
      String(input).includes("/oembed?")
        ? respond(metadata)
        : respond({
            items: [
              {
                statistics: {
                  viewCount: "1000",
                  likeCount: "100",
                  commentCount: "20",
                },
                snippet: { publishedAt: "2020-01-01T00:00:00Z" },
              },
            ],
          }),
  });
  assert.equal(report.source, "youtube-data-api");
  assert.deepEqual(report.metrics, {
    views: 1000,
    likes: 100,
    comments: 20,
    shares: null,
  });
  assert.equal(report.interactionRate, 12);
});
test("invalid and hidden counts stay missing rather than becoming zero", async () => {
  const report = await analyzeVideo(youtube, {
    youtubeKey: "test",
    fetcher: async (input) =>
      String(input).includes("/oembed?")
        ? respond(metadata)
        : respond({
            items: [
              {
                statistics: {
                  viewCount: "NaN",
                  likeCount: "",
                  commentCount: "-1",
                },
              },
            ],
          }),
  });
  assert.deepEqual(report.metrics, {
    views: null,
    likes: null,
    comments: null,
    shares: null,
  });
});
test("statistics failure preserves genuine metadata and explains missing statistics", async () => {
  const report = await analyzeVideo(youtube, {
    youtubeKey: "test",
    fetcher: async (input) =>
      String(input).includes("/oembed?") ? respond(metadata) : respond({}, 403),
  });
  assert.equal(report.title, metadata.title);
  assert.equal(report.source, "public-oembed");
  assert.equal(report.metrics.views, null);
  assert.ok(report.limitations.some((t) => t.includes("statistics did not")));
});
test("resolves approved TikTok short links and never follows a foreign redirect", async () => {
  let calls = 0;
  const good = await analyzeVideo("https://vm.tiktok.com/abc123/", {
    fetcher: async (_input, init) => {
      calls++;
      if (init?.method === "HEAD")
        return new Response(null, {
          status: 302,
          headers: { location: tiktok },
        });
      return respond(metadata);
    },
  });
  assert.equal(good.url, tiktok);
  assert.equal(calls, 2);
  calls = 0;
  await assert.rejects(
    analyzeVideo("https://vm.tiktok.com/abc123/", {
      fetcher: async () => {
        calls++;
        return new Response(null, {
          status: 302,
          headers: { location: "https://169.254.169.254/latest/meta-data" },
        });
      },
    }),
    AnalysisError,
  );
  assert.equal(calls, 1);
});
test("redirect loops are bounded", async () => {
  let calls = 0;
  await assert.rejects(
    analyzeVideo("https://vm.tiktok.com/abc123/", {
      fetcher: async () => {
        calls++;
        return new Response(null, {
          status: 302,
          headers: { location: "https://vm.tiktok.com/abc123/" },
        });
      },
    }),
    /Too many redirects/,
  );
  assert.equal(calls, 4);
});
test("provider timeout is actionable and does not expose internal errors", async () => {
  await assert.rejects(
    analyzeVideo(youtube, {
      fetcher: async () => {
        throw new Error("secret internal detail");
      },
    }),
    (error) =>
      error instanceof AnalysisError &&
      error.status === 502 &&
      !error.message.includes("secret"),
  );
});
test("private video fails without fallback data", async () => {
  await assert.rejects(
    analyzeVideo(youtube, { fetcher: async () => respond({}, 404) }),
    (error) => error instanceof AnalysisError && error.status === 422,
  );
});
test("malformed provider JSON and incomplete metadata fail", async () => {
  await assert.rejects(
    analyzeVideo(youtube, { fetcher: async () => new Response("{broken") }),
    AnalysisError,
  );
  await assert.rejects(
    analyzeVideo(youtube, { fetcher: async () => respond({}) }),
    /incomplete video metadata/,
  );
});
test("provider streaming payloads are bounded", async () => {
  await assert.rejects(
    analyzeVideo(youtube, {
      fetcher: async () => new Response("a".repeat(262145)),
    }),
    /oversized response/,
  );
});
test("current TikTok embed-only response succeeds without fabricating caption metadata", async () => {
  const report = await analyzeVideo(tiktok, {
    fetcher: async () =>
      respond({
        type: "video",
        embed_product_id: "6718335390845095173",
        html: "<iframe/>",
      }),
  });
  assert.equal(report.author, "@scout2015");
  assert.match(report.title, /title not supplied/);
  assert.ok(report.limitations.some((s) => s.includes("omitted title")));
  assert.ok(!report.observations.some((s) => s.includes("characters")));
});
