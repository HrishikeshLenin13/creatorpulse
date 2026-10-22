export function Sidebar() {
  return (
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
  );
}
