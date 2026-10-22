import { PerformanceChart } from '@/components/PerformanceChart';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { mockVideoMetrics, revenueSources } from '@/lib/data';
import { formatCompactNumber } from '@/lib/utils';

const dashboardStats = [
  { label: 'Total views', value: '1.2M', delta: '+18.4%' },
  { label: 'Avg engagement', value: '12.1%', delta: '+2.3%' },
  { label: 'Watch time', value: '42.6h', delta: '+11.8%' },
  { label: 'Est. earnings', value: '$4,860', delta: '+9.7%' },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <Sidebar />

      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">Overview</span>
            <h1>Creator dashboard</h1>
          </div>
          <button className="primary-btn">Export report</button>
        </header>

        <div className="stats-grid">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} delta={stat.delta} />
          ))}
        </div>

        <div className="content-grid">
          <div className="panel glass-panel large-panel">
            <div className="panel-head">
              <div>
                <span className="muted-label">Performance trend</span>
                <h2>Weekly reach</h2>
              </div>
              <span className="status-pill">Updated 2m ago</span>
            </div>

            <div className="chart-panel">
              <PerformanceChart />
            </div>
          </div>

          <div className="panel glass-panel side-panel">
            <div className="panel-head">
              <div>
                <span className="muted-label">Estimated revenue</span>
                <h2>$4,860</h2>
              </div>
            </div>

            <div className="revenue-list">
              {revenueSources.map((source) => (
                <div key={source.label}>
                  <span>{source.label}</span>
                  <strong>{source.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-panel glass-panel">
          <div className="panel-head">
            <div>
              <span className="muted-label">Recent content</span>
              <h2>Top-performing posts</h2>
            </div>
          </div>

          <div className="table-wrap">
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
                {mockVideoMetrics.map((video) => (
                  <tr key={video.id}>
                    <td>{video.title}</td>
                    <td>{formatCompactNumber(video.views)}</td>
                    <td>{formatCompactNumber(video.likes)}</td>
                    <td>{formatCompactNumber(video.comments)}</td>
                    <td>{formatCompactNumber(video.shares)}</td>
                    <td>
                      <span className="engagement-pill">{video.engagementRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
