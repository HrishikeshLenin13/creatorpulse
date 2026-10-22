import Link from "next/link";
import { Brand } from "@/components/Sidebar";
import { Icon } from "@/components/Icon";
import { VideoAnalyzer } from "@/components/VideoAnalyzer";
export default function HomePage() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <Brand />
        <nav aria-label="Site navigation">
          <Link href="/dashboard/content">Explore sample analytics</Link>
          <Link href="/dashboard" className="button secondary">
            Open workspace
            <Icon name="arrow" size={16} />
          </Link>
        </nav>
      </header>
      <section className="landing-hero">
        <span className="tag">
          <span className="status-dot" /> Made for curious creators
        </span>
        <h1>
          Good content starts
          <br />
          with a better question.
        </h1>
        <p>
          Get to know your videos. Explore the numbers, keep your insights, and
          make your next creative move with a little more clarity.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/dashboard">
            Explore your workspace
            <Icon name="arrow" size={18} />
          </Link>
          <span>No sign-up. No invented metrics.</span>
        </div>
        <div className="hero-wave" aria-hidden="true">
          {[
            24, 38, 55, 32, 67, 90, 48, 72, 110, 140, 90, 64, 104, 72, 48, 86,
            122, 155, 115, 78, 100, 130, 94, 60, 90, 120, 160, 132, 84, 52, 76,
            110, 80, 48, 64, 36,
          ].map((h, i) => (
            <i key={i} style={{ height: h }} />
          ))}
        </div>
      </section>
      <div className="landing-analyzer">
        <VideoAnalyzer />
      </div>
      <section className="landing-features">
        <div>
          <Icon name="link" />
          <h2>Start with what’s public.</h2>
          <p>
            Paste a TikTok or YouTube link for real creator details and metadata
            from the official platform.
          </p>
        </div>
        <div>
          <Icon name="chart" />
          <h2>Know what’s measured.</h2>
          <p>
            Clearly labeled sample analytics and available YouTube statistics.
            No fictional reach or retention curves.
          </p>
        </div>
        <div>
          <Icon name="wallet" />
          <h2>Make room for experiments.</h2>
          <p>
            Compare sample content, model revenue assumptions, and build a
            browser-local library of real reports.
          </p>
        </div>
      </section>
      <footer className="landing-footer">
        <Brand />
        <span>More clarity. Better creative decisions.</span>
        <Link href="/dashboard/settings">Data & privacy</Link>
      </footer>
    </main>
  );
}
