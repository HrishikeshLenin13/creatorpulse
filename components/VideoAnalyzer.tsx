"use client";
import { useRef, useState, type FormEvent } from "react";
import type { VideoReport } from "@/lib/video-types";
import { parseVideoUrl } from "@/lib/video-url";
import { saveReport } from "@/lib/report-store";
import { downloadFile } from "@/lib/export";
import { formatCompactNumber } from "@/lib/utils";
import { Icon } from "./Icon";
export function Report({ report }: { report: VideoReport }) {
  const [preview, setPreview] = useState(false);
  return (
    <section className="report panel" aria-label="Video report">
      <div className="panel-heading">
        <span className="tag success">
          <Icon name="check" size={14} /> Real public data
        </span>
        <button
          className="button secondary small"
          onClick={() =>
            downloadFile(
              `creatorpulse-${report.id}.json`,
              JSON.stringify(report, null, 2),
            )
          }
        >
          <Icon name="download" size={16} />
          Export report
        </button>
      </div>
      <div className="report-heading">
        <div
          className={
            "video-tile " + (report.platform === "youtube" ? "peach" : "lilac")
          }
        >
          <Icon name="play" size={32} />
        </div>
        <div>
          <span className="muted">
            {report.platform === "youtube" ? "YouTube" : "TikTok"} ·{" "}
            {report.author}
          </span>
          <h2>{report.title || "Untitled video"}</h2>
          <a
            href={report.url}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Open original <Icon name="external" size={14} />
          </a>
        </div>
      </div>
      <div className="report-metrics">
        {(["views", "likes", "comments", "shares"] as const).map((k) => (
          <div key={k}>
            <span>{k[0].toUpperCase() + k.slice(1)}</span>
            <strong>
              {report.metrics[k] === null
                ? "—"
                : formatCompactNumber(report.metrics[k])}
            </strong>
            <small>
              {report.metrics[k] === null
                ? "Not provided"
                : "Measured by platform"}
            </small>
          </div>
        ))}
      </div>
      <div className="report-columns">
        <div>
          <h3>What this link tells us</h3>
          <ul>
            {report.observations.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="data-note">
          <h3>Know the limits</h3>
          {report.limitations.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </div>
      {preview ? (
        <iframe
          className="video-embed"
          title="Video preview"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="encrypted-media; fullscreen"
          allowFullScreen
          src={
            report.platform === "youtube"
              ? `https://www.youtube-nocookie.com/embed/${report.id}`
              : `https://www.tiktok.com/player/v1/${report.id}`
          }
        />
      ) : (
        <button className="button secondary" onClick={() => setPreview(true)}>
          <Icon name="play" size={17} />
          Load video preview
        </button>
      )}
      <p className="fine-print">
        {preview
          ? "The player connects directly to the video platform."
          : "Loading a preview connects to the video platform."}{" "}
        Fetched {new Date(report.fetchedAt).toLocaleString()} ·{" "}
        {report.source === "youtube-data-api"
          ? "YouTube Data API + oEmbed"
          : "Official public oEmbed"}
      </p>
    </section>
  );
}
export function VideoAnalyzer({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<VideoReport | null>(null);
  const inFlight = useRef(false);
  async function analyze(event: FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    setError("");
    setNotice("");
    setResult(null);
    try {
      parseVideoUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check the video link.");
      return;
    }
    inFlight.current = true;
    setLoading(true);
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(40000),
      });
      const data = await response.json();
      if (!response.ok || !data.report)
        throw new Error(
          data.message ?? "The analysis did not complete. Try again.",
        );
      const report: VideoReport = data.report;
      setResult(report);
      try {
        saveReport(report);
        setNotice("Report saved in this browser.");
      } catch {
        setNotice(
          "Report ready. Browser storage is unavailable; export it to keep a copy.",
        );
      }
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "TimeoutError"
          ? e.message
          : "The request timed out. Please try again.",
      );
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }
  return (
    <div className="analyzer-stack">
      <section className={"analyzer " + (compact ? "compact" : "")}>
        <div className="analyzer-heading">
          <span className="analyzer-icon">
            <Icon name="bolt" size={23} />
          </span>
          <div>
            <h2>
              {compact
                ? "Your next insight starts with a link."
                : "Give your content a closer look."}
            </h2>
            <p>
              Paste a public video. Get real metadata, available metrics, and a
              report worth keeping.
            </p>
          </div>
        </div>
        <form onSubmit={analyze} className="analyze-form">
          <label htmlFor="video-url" className="sr-only">
            Video URL
          </label>
          <div className="url-field">
            <Icon name="link" size={20} />
            <input
              id="video-url"
              type="url"
              required
              maxLength={2048}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a TikTok or YouTube video link…"
              aria-describedby="video-help"
              disabled={loading}
            />
          </div>
          <button className="button primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Fetching video…
              </>
            ) : (
              <>
                Analyze video
                <Icon name="arrow" size={18} />
              </>
            )}
          </button>
        </form>
        <div className="analyzer-foot" id="video-help">
          <span>
            <b>♪</b> TikTok <span className="separator" /> <b>▶</b> YouTube &
            Shorts
          </span>
          <span>Public metadata · No sign-in required</span>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <div role="status" aria-live="polite">
          {loading && (
            <p className="loading-message">
              Checking the link and contacting the official provider…
            </p>
          )}
          {notice && <p className="loading-message">{notice}</p>}
        </div>
      </section>
      {result && (
        <Report
          key={result.platform + result.id + result.fetchedAt}
          report={result}
        />
      )}
    </div>
  );
}
