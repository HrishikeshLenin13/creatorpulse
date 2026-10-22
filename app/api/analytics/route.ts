import { analyzeVideo } from "@/lib/providers/public-video";
import { AnalysisError } from "@/lib/video-url";
import { acquire, readJson } from "@/lib/request";
export const runtime = "nodejs";
export async function GET() {
  return Response.json(
    {
      service: "CreatorPulse public video lookup",
      platforms: ["tiktok", "youtube"],
      youtubeStatisticsConfigured: Boolean(process.env.YOUTUBE_API_KEY),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { ok: false, message: "Cross-origin requests are not accepted." },
      { status: 403, headers },
    );
  let release: (() => void) | null = null;
  try {
    const body = await readJson(request);
    if (!body || typeof body !== "object" || !("url" in body))
      throw new AnalysisError("A video URL is required.");
    release = acquire();
    if (!release)
      return Response.json(
        {
          ok: false,
          message: "The workspace is busy. Please try again in a minute.",
        },
        { status: 429, headers: { ...headers, "Retry-After": "60" } },
      );
    const report = await analyzeVideo(body.url, {
      youtubeKey: process.env.YOUTUBE_API_KEY,
    });
    return Response.json({ ok: true, report }, { headers });
  } catch (error) {
    const known = error instanceof AnalysisError;
    return Response.json(
      {
        ok: false,
        message: known
          ? error.message
          : "The analysis could not be completed. Please try again.",
        code: known ? error.code : "INTERNAL_ERROR",
      },
      { status: known ? error.status : 500, headers },
    );
  } finally {
    release?.();
  }
}
