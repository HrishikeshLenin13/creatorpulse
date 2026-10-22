import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { VideoAnalyzer } from '@/components/VideoAnalyzer';

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
          <span className="nav-label">Workspace</span>
          <a className="side-link active" href="#">Dashboard</a>
          <a className="side-link" href="#">Analytics</a>
          <a className="side-link" href="#">Posts</a>
          <a className="side-link" href="#">Revenue</a>
        </nav>

        <div className="sidebar-card">
          <span className="muted-label">Current focus</span>
          <strong>Short-form growth</strong>
          <small>Best performing content format this month</small>
        </div>

        <div className="sidebar-footer">
          <Link href="/login" className="ghost-btn wide-btn">Sign out</Link>
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

        <AnalyticsDashboard />
        <VideoAnalyzer />
      </section>
    </main>
  );
}
