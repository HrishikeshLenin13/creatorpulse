"use client";
import Link from "next/link";
import { useState } from "react";
import { postsInWindow, type SamplePost } from "@/lib/data";
import { engagementRate, relativeLift } from "@/lib/metrics";
import { csvCell, downloadFile } from "@/lib/export";
import { formatCompactNumber } from "@/lib/utils";
import { Icon } from "./Icon";
import { PerformanceChart } from "./PerformanceChart";
export function ContentTable({ posts }: { posts: SamplePost[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = posts
    .filter((p) =>
      (p.title + p.category).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "views"
        ? b.views - a.views
        : sort === "engagement"
          ? (engagementRate(b) ?? 0) - (engagementRate(a) ?? 0)
          : b.date.localeCompare(a.date),
    );
  return (
    <section className="panel content-panel">
      <div className="panel-heading">
        <div>
          <h2>Content performance</h2>
          <p>Sample posts · Lifetime metrics</p>
        </div>
        <button
          className="button secondary small"
          onClick={() =>
            downloadFile(
              "creatorpulse-sample-content.csv",
              [
                [
                  "Source",
                  "Title",
                  "Published (UTC)",
                  "Views",
                  "Likes",
                  "Comments",
                  "Shares",
                  "Engagement by views (%)",
                ],
                ...filtered.map((p) => [
                  "SAMPLE",
                  p.title,
                  p.date,
                  p.views,
                  p.likes,
                  p.comments,
                  p.shares,
                  engagementRate(p)?.toFixed(2) ?? "",
                ]),
              ]
                .map((row) => row.map(csvCell).join(","))
                .join("\r\n"),
              "text/csv;charset=utf-8",
            )
          }
        >
          <Icon name="download" size={16} />
          Export CSV
        </button>
      </div>
      <div className="table-controls">
        <label className="search-field">
          <Icon name="search" size={17} />
          <input
            aria-label="Search content"
            placeholder="Search content or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          aria-label="Sort content"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="date">Most recent</option>
          <option value="views">Most viewed</option>
          <option value="engagement">Highest engagement</option>
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Video</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Shares</th>
              <th>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <button
                    className="post-button"
                    aria-expanded={selected === p.id}
                    onClick={() => setSelected(selected === p.id ? null : p.id)}
                  >
                    <span className={"post-art " + p.color}>
                      <Icon name="play" size={20} />
                    </span>
                    <span>
                      <strong>{p.title}</strong>
                      <small>
                        {p.category} · {p.date}
                      </small>
                      {selected === p.id && (
                        <span className="post-detail">
                          Sample record. Engagement = (
                          {p.likes.toLocaleString()} likes + {p.comments}{" "}
                          comments + {p.shares.toLocaleString()} shares) ÷{" "}
                          {p.views.toLocaleString()} views × 100. No retention
                          or earnings data.
                        </span>
                      )}
                    </span>
                  </button>
                </td>
                <td>{formatCompactNumber(p.views)}</td>
                <td>{formatCompactNumber(p.likes)}</td>
                <td>{formatCompactNumber(p.comments)}</td>
                <td>{formatCompactNumber(p.shares)}</td>
                <td>
                  <span className="engagement">
                    {engagementRate(p)?.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <p className="empty-inline">
          No matching posts. Try another title or category.
        </p>
      )}
      <div className="table-footer">
        Showing {filtered.length} of {posts.length} sample posts{" "}
        <span>Engagement = (likes + comments + shares) ÷ views</span>
      </div>
    </section>
  );
}
export function AnalyticsDashboard({
  contentOnly = false,
}: {
  contentOnly?: boolean;
}) {
  const [days, setDays] = useState(30);
  const posts = postsInWindow(days);
  const totals = posts.reduce(
    (a, p) => ({
      views: a.views + p.views,
      likes: a.likes + p.likes,
      comments: a.comments + p.comments,
      shares: a.shares + p.shares,
    }),
    { views: 0, likes: 0, comments: 0, shares: 0 },
  );
  const top = [...posts].sort((a, b) => b.views - a.views)[0];
  const otherAverage =
    posts.length > 1 ? (totals.views - top.views) / (posts.length - 1) : 0;
  const lift = relativeLift(top.views, otherAverage);
  return (
    <div className="analytics-stack">
      <div className="sample-strip">
        <span>
          <Icon name="info" size={16} />
          <strong>Sample workspace</strong> Explore the product with
          illustrative data. Your video reports stay separate.
        </span>
        <select
          aria-label="Publication window"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>
      {!contentOnly && (
        <>
          <div className="stats-grid">
            {[
              {
                label: "Total views",
                value: formatCompactNumber(totals.views),
                detail: `Across ${posts.length} sample posts`,
                icon: "chart" as const,
              },
              {
                label: "Engagement by views",
                value: `${engagementRate(totals)?.toFixed(2)}%`,
                detail: "Weighted across selected posts",
                icon: "heart" as const,
              },
              {
                label: "Total shares",
                value: formatCompactNumber(totals.shares),
                detail: "Sample platform count",
                icon: "external" as const,
              },
              {
                label: "Avg. views per post",
                value: formatCompactNumber(totals.views / posts.length),
                detail: "Lifetime views / post count",
                icon: "play" as const,
              },
            ].map((s) => (
              <section className="stat-card" key={s.label}>
                <div>
                  <span>{s.label}</span>
                  <Icon name={s.icon} size={18} />
                </div>
                <strong>{s.value}</strong>
                <small>{s.detail}</small>
              </section>
            ))}
          </div>
          <div className="insight-grid">
            <section className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <h2>A little perspective on your reach</h2>
                  <p>Lifetime views grouped by post publication date</p>
                </div>
                <span className="legend">
                  <i /> Sample views
                </span>
              </div>
              <PerformanceChart posts={posts} />
              <p className="chart-footnote">
                Publication window ends Oct 22, 2026 (UTC). Not a historical
                daily-view series.
              </p>
            </section>
            <section className="insight-panel">
              <div className="insight-title">
                <Icon name="bolt" size={18} /> From the sample data
              </div>
              <h2>Worth a second look.</h2>
              <p className="insight-big">
                {lift?.toFixed(0)}%
                <span>
                  more views than the other selected posts, on average
                </span>
              </p>
              <p>
                “{top.title}” leads this set with{" "}
                <strong>{formatCompactNumber(top.views)} views.</strong>
              </p>
              <div className="insight-divider" />
              <p className="insight-note">
                Try a follow-up in the same format. Treat it as an experiment,
                not proof of what caused the lift.
              </p>
              <Link href="/dashboard/content" className="insight-link">
                Explore the content <Icon name="arrow" size={16} />
              </Link>
            </section>
          </div>
        </>
      )}
      <ContentTable posts={posts} />
    </div>
  );
}
