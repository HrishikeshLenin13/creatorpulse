import type { SamplePost } from "@/lib/data";
import { formatCompactNumber } from "@/lib/utils";
export function PerformanceChart({ posts }: { posts: SamplePost[] }) {
  const ordered = [...posts].sort((a, b) => a.date.localeCompare(b.date));
  const max = Math.max(...posts.map((p) => p.views), 1);
  return (
    <div
      className="performance-chart"
      role="img"
      aria-label={
        "Sample lifetime views by publication date. " +
        ordered.map((p) => `${p.date}: ${p.views} views`).join("; ")
      }
    >
      <div className="chart-labels">
        <span>{formatCompactNumber(max)}</span>
        <span>{formatCompactNumber(max / 2)}</span>
        <span>0</span>
      </div>
      <div className="chart-plot">
        <div className="chart-grid">
          <i />
          <i />
          <i />
        </div>
        <div className="chart-bars">
          {ordered.map((p) => (
            <div className="chart-column" key={p.id}>
              <div
                className="chart-bar"
                style={{ height: `${(p.views / max) * 100}%` }}
              >
                <span>{formatCompactNumber(p.views)}</span>
              </div>
              <small>{p.date.slice(5).replace("-", "/")}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
