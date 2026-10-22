import Link from "next/link";
import { Icon } from "./Icon";
export type View = "overview" | "analyzer" | "content" | "revenue" | "settings";
export const navigation = [
  { view: "overview", label: "Overview", icon: "grid", href: "/dashboard" },
  {
    view: "analyzer",
    label: "Video analyzer",
    icon: "bolt",
    href: "/dashboard/analyzer",
  },
  {
    view: "content",
    label: "Content library",
    icon: "play",
    href: "/dashboard/content",
  },
  {
    view: "revenue",
    label: "Revenue planner",
    icon: "wallet",
    href: "/dashboard/revenue",
  },
  {
    view: "settings",
    label: "Workspace settings",
    icon: "settings",
    href: "/dashboard/settings",
  },
] as const;
export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-symbol" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      CreatorPulse<span className="brand-dot">.</span>
    </Link>
  );
}
export function Sidebar({ view }: { view: View }) {
  return (
    <aside className="sidebar">
      <Brand />
      <div className="workspace-name">
        <span className="workspace-avatar">C</span>
        <div>
          <strong>Creator workspace</strong>
          <small>Local workspace</small>
        </div>
      </div>
      <p className="nav-caption">Your studio</p>
      <nav aria-label="Main navigation">
        {navigation.map((n) => (
          <Link
            key={n.view}
            href={n.href}
            aria-current={view === n.view ? "page" : undefined}
            className={"side-link " + (view === n.view ? "active" : "")}
          >
            <Icon name={n.icon} />
            {n.label}
            {n.view === "analyzer" && <span className="new-label">New</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-note">
        <span className="note-icon">
          <Icon name="link" />
        </span>
        <h3>One link. A clearer picture.</h3>
        <p>Start with a public TikTok or YouTube video. No account needed.</p>
        <Link href="/dashboard/analyzer">
          Analyze a video <Icon name="arrow" size={16} />
        </Link>
      </div>
      <div className="sidebar-bottom">
        <span className="status-dot" /> Public-link mode{" "}
        <span className="version">v0.2</span>
      </div>
    </aside>
  );
}
