"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar, navigation, type View } from "./Sidebar";
import { Icon } from "./Icon";
import { VideoAnalyzer, Report } from "./VideoAnalyzer";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { clearReports, useReports } from "@/lib/report-store";
import { downloadFile } from "@/lib/export";
import { estimateRevenue } from "@/lib/metrics";
import { formatCurrency } from "@/lib/utils";
const headings: Record<View, { title: string; description: string }> = {
  overview: {
    title: "Make your next post count.",
    description:
      "A clearer view of your content. A more intentional next move.",
  },
  analyzer: {
    title: "From video link to insight.",
    description:
      "Real public data. Clear limitations. No made-up performance scores.",
  },
  content: {
    title: "Your content, in perspective.",
    description:
      "Explore sample performance and revisit your real video reports.",
  },
  revenue: {
    title: "Plan the possibilities.",
    description: "Model potential revenue with assumptions you control.",
  },
  settings: {
    title: "A workspace that’s yours.",
    description: "Manage local reports and understand your connections.",
  },
};
function RevenuePlanner() {
  const [views, setViews] = useState("100000");
  const [low, setLow] = useState("0.40");
  const [high, setHigh] = useState("1.00");
  let range: [number, number] | null = null;
  try {
    if ([views, low, high].some((v) => !v.trim())) throw new Error();
    range = estimateRevenue(Number(views), Number(low), Number(high));
  } catch {
    /* Show an actionable validation message below. */
  }
  return (
    <section className="panel revenue-planner">
      <span className="tag">Scenario, not actual earnings</span>
      <h2>What could your views be worth?</h2>
      <p>
        RPM means revenue per 1,000 eligible views. These defaults are
        illustrative assumptions, not platform rates.
      </p>
      <div className="planner-fields">
        <label>
          Eligible views
          <input
            type="number"
            min="0"
            step="1"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </label>
        <label>
          Low RPM (USD)
          <input
            type="number"
            min="0"
            step="0.01"
            value={low}
            onChange={(e) => setLow(e.target.value)}
          />
        </label>
        <label>
          High RPM (USD)
          <input
            type="number"
            min="0"
            step="0.01"
            value={high}
            onChange={(e) => setHigh(e.target.value)}
          />
        </label>
      </div>
      <div className="revenue-result" aria-live="polite">
        <span>Modeled revenue range</span>
        <strong>
          {range
            ? `${formatCurrency(range[0])} – ${formatCurrency(range[1])}`
            : "Check your assumptions"}
        </strong>
        <p>
          {range
            ? "Eligible views ÷ 1,000 × assumed RPM"
            : "Enter nonnegative numbers. Low RPM must not exceed high RPM."}
        </p>
      </div>
      <div className="data-note">
        <h3>A model, not a promise</h3>
        <p>
          Total views may differ from eligible views. Geography, program
          eligibility, content, and platform rules affect payouts. This excludes
          sponsorships, taxes, fees, and actual earnings data.
        </p>
      </div>
    </section>
  );
}
function Settings() {
  const reports = useReports();
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [youtube, setYoutube] = useState<boolean | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/analytics", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setYoutube(Boolean(d.youtubeStatisticsConfigured)))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <div className="settings-grid">
      <section className="panel">
        <h2>Platform connections</h2>
        <p>
          Public metadata needs no credentials. Private analytics are not
          connected.
        </p>
        <div className="connection">
          <span className="platform-icon">♪</span>
          <div>
            <strong>TikTok</strong>
            <small>Official public video metadata</small>
          </div>
          <span className="tag">Public links</span>
        </div>
        <div className="connection">
          <span className="platform-icon youtube">▶</span>
          <div>
            <strong>YouTube</strong>
            <small>
              {youtube === null
                ? "Checking statistics configuration…"
                : youtube
                  ? "Statistics API key configured; availability depends on quota"
                  : "Add YOUTUBE_API_KEY on the server for statistics"}
            </small>
          </div>
          <span className="tag">
            {youtube ? "Key configured" : "Public links"}
          </span>
        </div>
        <div className="data-note">
          <h3>Cloud accounts are not enabled</h3>
          <p>
            No passwords or platform tokens are collected. TikTok private
            metrics require an approved app, OAuth, encrypted token storage, and
            a tenant-isolated backend before connection can be offered.
          </p>
        </div>
      </section>
      <section className="panel">
        <h2>Your browser, your reports</h2>
        <p>
          Up to 30 recent reports are stored only in this browser. They are not
          synced to an account or saved on our server. Anyone using this browser
          profile may see them.
        </p>
        <div className="storage-count">
          <strong>{reports.length}</strong>
          <span>saved reports</span>
        </div>
        <div className="settings-actions">
          <button
            className="button secondary"
            disabled={!reports.length}
            onClick={() =>
              downloadFile(
                "creatorpulse-reports.json",
                JSON.stringify(reports, null, 2),
              )
            }
          >
            <Icon name="download" size={17} />
            Export all reports
          </button>
          <button
            className="button danger"
            disabled={!reports.length}
            onClick={() => setConfirm(true)}
          >
            Delete local reports
          </button>
        </div>
        {confirm && (
          <div className="delete-confirm" role="alert">
            <p>
              Delete all saved reports from this browser? Export first if you
              want a copy.
            </p>
            <button
              className="button danger"
              onClick={() => {
                try {
                  clearReports();
                  setMessage("All local reports deleted.");
                  setConfirm(false);
                } catch {
                  setMessage(
                    "Browser storage is unavailable. Clear site data in your browser settings.",
                  );
                }
              }}
            >
              Confirm deletion
            </button>
            <button
              className="button secondary"
              onClick={() => setConfirm(false)}
            >
              Keep reports
            </button>
          </div>
        )}
        <p role="status">{message}</p>
      </section>
    </div>
  );
}
function SavedReports() {
  const reports = useReports();
  const [selected, setSelected] = useState<string | null>(null);
  const active = reports.find((r) => r.platform + r.id === selected);
  return (
    <section className="saved-reports">
      <div className="section-heading">
        <div>
          <h2>Saved video reports</h2>
          <p>Real results stored in this browser · {reports.length} reports</p>
        </div>
        <Link className="text-link" href="/dashboard/analyzer">
          Analyze another <Icon name="arrow" size={16} />
        </Link>
      </div>
      {reports.length ? (
        <div className="saved-list">
          {reports.map((r) => (
            <button
              className={
                "saved-item " +
                (selected === r.platform + r.id ? "selected" : "")
              }
              key={r.platform + r.id}
              onClick={() =>
                setSelected(
                  selected === r.platform + r.id ? null : r.platform + r.id,
                )
              }
              aria-expanded={selected === r.platform + r.id}
            >
              <span
                className={
                  "post-art " + (r.platform === "youtube" ? "peach" : "lilac")
                }
              >
                <Icon name="play" />
              </span>
              <span>
                <strong>{r.title}</strong>
                <small>
                  {r.author} · {r.platform} ·{" "}
                  {new Date(r.fetchedAt).toLocaleDateString()}
                </small>
              </span>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="play" size={28} />
          </span>
          <div>
            <h3>Your first report belongs here.</h3>
            <p>
              Analyze a public video link to build your personal reference
              library.
            </p>
          </div>
          <Link href="/dashboard/analyzer" className="button secondary">
            Analyze a video
          </Link>
        </div>
      )}
      {active && <Report key={active.platform + active.id} report={active} />}
    </section>
  );
}
export function Workspace({ view = "overview" }: { view?: View }) {
  const heading = headings[view];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar view={view} />
      <div className="workspace">
        <header className="topbar">
          <span>
            Workspace <span className="breadcrumb-divider">/</span>{" "}
            <strong>{navigation.find((n) => n.view === view)?.label}</strong>
          </span>
          <div>
            <span className="local-label">
              <span className="status-dot" />
              Local workspace
            </span>
            <span
              className="profile-avatar"
              aria-label="Local workspace profile"
            >
              C
            </span>
          </div>
        </header>
        <main id="main">
          <div className="page-heading">
            <div>
              <h1>{heading.title}</h1>
              <p>{heading.description}</p>
            </div>
            {view === "overview" && (
              <Link href="/dashboard/content" className="button secondary">
                <Icon name="play" size={17} />
                View content
              </Link>
            )}
          </div>
          {view === "overview" && (
            <>
              <VideoAnalyzer compact />
              <AnalyticsDashboard />
            </>
          )}
          {view === "analyzer" && (
            <>
              <VideoAnalyzer />
              <SavedReports />
              <section className="how-it-works">
                <div>
                  <Icon name="link" />
                  <h3>Start with a public link</h3>
                  <p>
                    TikTok full links and short links, YouTube videos, and
                    Shorts are supported.
                  </p>
                </div>
                <div>
                  <Icon name="chart" />
                  <h3>Read what’s actually there</h3>
                  <p>
                    Real title and creator details. YouTube public statistics
                    when configured.
                  </p>
                </div>
                <div>
                  <Icon name="download" />
                  <h3>Keep the useful parts</h3>
                  <p>
                    Export a JSON report or revisit it in your local content
                    library.
                  </p>
                </div>
              </section>
            </>
          )}
          {view === "content" && (
            <>
              <SavedReports />
              <AnalyticsDashboard contentOnly />
            </>
          )}
          {view === "revenue" && <RevenuePlanner />}
          {view === "settings" && <Settings />}
          <footer className="workspace-footer">
            <span>
              CreatorPulse <span>Built for the next good idea.</span>
            </span>
            <Link href="/dashboard/settings">
              Data & connections <Icon name="arrow" size={14} />
            </Link>
          </footer>
        </main>
      </div>
    </div>
  );
}
