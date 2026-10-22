import { mockVideoMetrics } from '@/lib/data';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';

const dashboardStats = [
  { label: 'Total views', value: '1.2M', delta: '+18.4%' },
  { label: 'Avg engagement', value: '12.1%', delta: '+2.3%' },
  { label: 'Watch time', value: '42.6h', delta: '+11.8%' },
  { label: 'Est. earnings', value: '$4,860', delta: '+9.7%' },
];

const performanceBars = [82, 64, 74, 91, 68, 88, 94];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <aside className="sidebar glass-panel">
        <div className="brand-wrap sidebar-brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">CreatorPulse</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Overview</span>
          <a className="side-link active" href="#">Dashboard</a>
          <a className="side-link" href="#">Content</a>
          <a className="side-link" href="#">Audience</a>
          <a className="side-link" href="#">Monetization</a>
        </nav>

        <div className="sidebar-card">
          <span className="muted-label">Current focus</span>
          <strong>Short-form growth</strong>
          <small>Best performing content format this month</small>
        </div>
      </aside>

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
            <div key={stat.label} className="stat-card glass-panel">
              <span className="muted-label">{stat.label}</span>
              <div className="stat-row">
                <strong>{stat.value}</strong>
                <span className="delta up">{stat.delta}</span>
              </div>
            </div>
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

            <div className="bars-wrap">
              {performanceBars.map((value, idx) => (
                <div key={idx} className="bar-cluster">
                  <div className="bar-track">
                    <span style={{ height: `${value}%` }} />
                  </div>
                  <small>{['M','T','W','T','F','S','S'][idx]}</small>
                </div>
              ))}
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
              <div>
                <span>Organic</span>
                <strong>$2,430</strong>
              </div>
              <div>
                <span>Sponsored</span>
                <strong>$1,690</strong>
              </div>
              <div>
                <span>Affiliate</span>
                <strong>$740</strong>
              </div>
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

