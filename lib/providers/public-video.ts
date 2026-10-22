import { AnalysisError, parseVideoUrl, type VideoTarget } from "../video-url";
import { interactionRate } from "../metrics";
import type { VideoReport } from "../video-types";
type Fetcher = typeof fetch;
const TIMEOUT_MS = 8000;
function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function count(value: unknown): number | null {
  if (
    typeof value !== "number" &&
    !(typeof value === "string" && /^\d+$/.test(value))
  )
    return null;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}
async function json(
  url: string,
  fetcher: Fetcher,
): Promise<Record<string, unknown>> {
  const response = await fetcher(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    redirect: "error",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new AnalysisError(
      response.status === 404 || response.status === 401
        ? "This video is private, removed, or unavailable for embedding. Try another public video."
        : "The video provider is temporarily unavailable or has limited requests. Try again later.",
      response.status === 404 || response.status === 401 ? 422 : 502,
      "PROVIDER_UNAVAILABLE",
    );
  if (Number(response.headers.get("content-length")) > 262144)
    throw new AnalysisError(
      "The provider returned an oversized response.",
      502,
      "INVALID_PROVIDER_RESPONSE",
    );
  // Bound streamed responses as well as Content-Length. Never inject provider HTML.
  const reader = response.body?.getReader();
  if (!reader)
    throw new AnalysisError(
      "The provider returned an empty response.",
      502,
      "INVALID_PROVIDER_RESPONSE",
    );
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 262144)
        throw new AnalysisError(
          "The provider returned an oversized response.",
          502,
          "INVALID_PROVIDER_RESPONSE",
        );
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const buffer = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return record(JSON.parse(new TextDecoder().decode(buffer)));
}
async function resolveShort(
  target: VideoTarget,
  fetcher: Fetcher,
): Promise<VideoTarget> {
  for (let hop = 0; hop < 4 && target.short; hop++) {
    const response = await fetcher(target.url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    const location = response.headers.get("location");
    await response.body?.cancel();
    if (![301, 302, 303, 307, 308].includes(response.status) || !location)
      throw new AnalysisError(
        "Open the short link in your browser and paste the full TikTok video URL.",
        422,
        "SHORT_LINK_UNRESOLVED",
      );
    // Revalidate each redirect before any subsequent request. Never fetch arbitrary destinations.
    target = parseVideoUrl(new URL(location, target.url).href);
    if (target.platform !== "tiktok")
      throw new AnalysisError(
        "The short link did not resolve to a TikTok video.",
      );
  }
  if (target.short)
    throw new AnalysisError(
      "Too many redirects. Paste the full TikTok video URL.",
      422,
      "SHORT_LINK_UNRESOLVED",
    );
  return target;
}
export async function analyzeVideo(
  input: unknown,
  options: { fetcher?: Fetcher; youtubeKey?: string } = {},
): Promise<VideoReport> {
  const fetcher = options.fetcher ?? fetch;
  let target = parseVideoUrl(input);
  try {
    if (target.short) target = await resolveShort(target, fetcher);
    const endpoint =
      target.platform === "youtube"
        ? "https://www.youtube.com/oembed"
        : "https://www.tiktok.com/oembed";
    const data = await json(
      `${endpoint}?url=${encodeURIComponent(target.url)}&format=json`,
      fetcher,
    );
    const hasTitle = typeof data.title === "string";
    const hasAuthor = typeof data.author_name === "string";
    const confirmedTikTokEmbed =
      target.platform === "tiktok" &&
      data.type === "video" &&
      data.embed_product_id === target.id;
    if ((!hasTitle || !hasAuthor) && !confirmedTikTokEmbed)
      throw new AnalysisError(
        "The provider returned incomplete video metadata. Try another public video.",
        502,
        "INVALID_PROVIDER_RESPONSE",
      );
    const report: VideoReport = {
      id: target.id,
      platform: target.platform,
      url: target.url,
      title:
        typeof data.title === "string"
          ? data.title.slice(0, 2000)
          : "TikTok video (title not supplied)",
      author:
        typeof data.author_name === "string"
          ? data.author_name.slice(0, 200)
          : new URL(target.url).pathname.split("/")[1],
      fetchedAt: new Date().toISOString(),
      source: "public-oembed",
      metrics: { views: null, likes: null, comments: null, shares: null },
      publishedAt: null,
      interactionRate: null,
      observations: [],
      limitations: [
        "This report reads public metadata, not the video frames or audio. Retention, audience demographics, and actual earnings are not available from a public link.",
      ],
    };
    if (!hasTitle || !hasAuthor)
      report.limitations.push(
        "TikTok confirmed an embeddable video but omitted title or creator metadata. The displayed handle comes from the video URL, not a verified creator profile.",
      );
    if (target.platform === "youtube" && options.youtubeKey) {
      try {
        const params = new URLSearchParams({
          part: "snippet,statistics",
          id: target.id,
          key: options.youtubeKey,
        });
        const api = await json(
          `https://www.googleapis.com/youtube/v3/videos?${params}`,
          fetcher,
        );
        const item = record(Array.isArray(api.items) ? api.items[0] : null);
        if (!Object.keys(item).length)
          throw new AnalysisError(
            "Statistics are unavailable for this video.",
            422,
          );
        const stats = record(item.statistics);
        const snippet = record(item.snippet);
        report.metrics = {
          views: count(stats.viewCount),
          likes: count(stats.likeCount),
          comments: count(stats.commentCount),
          shares: null,
        };
        report.publishedAt =
          typeof snippet.publishedAt === "string" &&
          Number.isFinite(Date.parse(snippet.publishedAt))
            ? snippet.publishedAt
            : null;
        report.source = "youtube-data-api";
        report.interactionRate = interactionRate(report.metrics);
      } catch {
        report.limitations.push(
          "Public metadata loaded, but YouTube statistics did not. Check the server API key, API enablement, and quota, then retry.",
        );
      }
    } else {
      report.limitations.push(
        target.platform === "youtube"
          ? "Views, likes, and comments require a server-side YOUTUBE_API_KEY. Public metadata works without a key."
          : "TikTok public embeds do not provide engagement statistics. Creator analytics require an approved TikTok app and account authorization.",
      );
    }
    if (hasTitle) {
      const hashtags = report.title.match(/#[\p{L}\p{N}_]+/gu) ?? [];
      report.observations.push(
        `The public title/caption contains ${report.title.length} characters and ${hashtags.length} hashtag${hashtags.length === 1 ? "" : "s"}.`,
      );
    } else {
      report.observations.push(
        "The official public endpoint returned an embed for this video. No caption was supplied, so caption analysis is unavailable.",
      );
    }
    if (report.interactionRate !== null)
      report.observations.push(
        `Likes and comments equal ${report.interactionRate.toFixed(2)}% of reported views. This excludes shares and is not a retention metric.`,
      );
    report.observations.push(
      "Experiment idea: test a different opening on a comparable future post and compare measured results. A single link does not establish what caused performance.",
    );
    return report;
  } catch (error) {
    if (error instanceof AnalysisError) throw error;
    throw new AnalysisError(
      "The video provider did not respond with usable data. Check that the video is public, then try again.",
      502,
      "PROVIDER_UNAVAILABLE",
    );
  }
}
