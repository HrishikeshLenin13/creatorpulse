export type VideoTarget = {
  platform: "tiktok" | "youtube";
  id: string;
  url: string;
  short: boolean;
};
export class AnalysisError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "INVALID_URL",
  ) {
    super(message);
  }
}
export function parseVideoUrl(input: unknown): VideoTarget {
  if (typeof input !== "string" || input.length > 2048 || !input.trim())
    throw new AnalysisError("Paste a public TikTok or YouTube video link.");
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new AnalysisError(
      "Enter a complete video URL starting with https://.",
    );
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port)
    throw new AnalysisError(
      "Use an HTTPS video link without credentials or a custom port.",
    );
  const host = url.hostname;
  if (
    ["vm.tiktok.com", "vt.tiktok.com"].includes(host) &&
    /^\/[a-zA-Z0-9]+\/?$/.test(url.pathname)
  ) {
    return {
      platform: "tiktok",
      id: "",
      url: url.origin + url.pathname,
      short: true,
    };
  }
  if (["www.tiktok.com", "tiktok.com", "m.tiktok.com"].includes(host)) {
    if (/^\/t\/[a-zA-Z0-9]+\/?$/.test(url.pathname))
      return {
        platform: "tiktok",
        id: "",
        url: `https://www.tiktok.com${url.pathname}`,
        short: true,
      };
    const match = url.pathname.match(
      /^\/@([\w.-]{1,64})\/video\/(\d{15,25})\/?$/,
    );
    if (match)
      return {
        platform: "tiktok",
        id: match[2],
        url: `https://www.tiktok.com/@${match[1]}/video/${match[2]}`,
        short: false,
      };
  }
  if (
    ["www.youtube.com", "youtube.com", "m.youtube.com", "youtu.be"].includes(
      host,
    )
  ) {
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.pathname === "/watch"
          ? url.searchParams.get("v")
          : url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)\/?$/)?.[1];
    if (id && /^[\w-]{11}$/.test(id))
      return {
        platform: "youtube",
        id,
        url: `https://www.youtube.com/watch?v=${id}`,
        short: false,
      };
  }
  throw new AnalysisError(
    "That link is not supported. Paste a TikTok video, YouTube video, or YouTube Shorts link.",
  );
}
