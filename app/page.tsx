import Link from 'next/link';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import { mockVideoMetrics } from '@/lib/data';

const creatorHighlights = [
  { name: 'Audience growth', value: '+34.2%', tone: 'up' },
  { name: 'Avg CTR', value: '8.4%', tone: 'up' },
  { name: 'Watch time', value: '24.8m', tone: 'neutral' },
  { name: 'Revenue trend', value: '+19.1%', tone: 'up' },
];

const featureList = [
  {
    title: 'Performance tracking',
    description: 'Live monitoring of views, likes, watch time, and audience engagement across your most recent posts.',
    tone: 'cyan',
    symbol: '↗',
  },
  {
    title: 'Content comparison',
    description: 'Compare posts side-by-side to find the hooks, formats, and pacing that consistently create lift.',
    tone: 'violet',
    symbol: '◎',
  },
  {
    title: 'Monetization estimates',
    description: 'Understand revenue potential with transparent CPM-style estimates and creator-focused projections.',
    tone: 'green',
    symbol: '$',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    subtitle: 'For new creators',
    features: ['3 tracked videos', 'Basic analytics', 'Weekly summary'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$29',
    subtitle: 'For growing accounts',
    features: ['Unlimited content tracking', 'Trend insights', 'Revenue forecasting'],
    highlight: true,
  },
  {
    name: 'Scale',
    price: '$79',
    subtitle: 'For power creators',
    features: ['Advanced cohort analysis', 'Team access', 'Priority support'],
    highlight: false,
  },
];

export default function HomePage() {
  const mainVideo = mockVideoMetrics[0];

  return (
    <main className="page-shell">
      <div className="container">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark">C</div>
            <div>
              <div className="brand-name">CreatorPulse</div>
              <div className="brand-tag">Creator analytics</div>
            </div>
          </div>

          <nav className="nav">
            <a href="#insights">Insights</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="nav-actions">
            <button className="ghost-btn">Login</button>
            <Link href="/dashboard" className="primary-btn">
              Launch dashboard
            </Link>
          </div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Better content decisions</span>
            <h1>Turn every TikTok post into smarter growth.</h1>
            <p>
              Measure real performance, compare content, and estimate monetization with a polished analytics dashboard built for creators.
            </p>

            <div className="cta-row">
              <Link href="/dashboard" className="primary-btn large">
                Explore dashboard
              </Link>
              <button className="ghost-btn large">Book a demo</button>
            </div>

            <div className="mini-stats">
              {creatorHighlights.map((item) => (
                <div key={item.name} className="mini-stat">
                  <span>{item.name}</span>
                  <strong className={item.tone === 'up' ? 'up' : ''}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel glass-panel">
            <div className="panel-header">
              <span>Performance snapshot</span>
              <span className="status-pill">Live</span>
            </div>

            <div className="hero-card-main">
              <div>
                <div className="muted-label">Top post</div>
                <div className="post-title">Day in the life of a creator</div>
              </div>
              <div className="large-metric">{formatCompactNumber(mainVideo.views)}</div>
            </div>

            <div className="metric-grid">
              <div className="metric-box">
                <span>Views</span>
                <strong>{formatCompactNumber(mainVideo.views)}</strong>
              </div>
              <div className="metric-box">
                <span>Engagement</span>
                <strong>{mainVideo.engagementRate}%</strong>
              </div>
              <div className="metric-box">
                <span>Earnings</span>
                <strong>{formatCurrency(mainVideo.estimatedEarnings)}</strong>
              </div>
            </div>

            <div className="sparkline" aria-label="Content performance trend">
              {mainVideo.trend.map((point, index) => (
                <span
                  key={index}
                  style={{ height: `${point}%` }}
                  className={index === mainVideo.trend.length - 1 ? 'active' : ''}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="feature-strip">
          <div className="feature-card glass-panel">
            <span className="muted-label">Views</span>
            <strong>{formatCompactNumber(mainVideo.views)}</strong>
            <small>Up 18.6% from last week</small>
          </div>
          <div className="feature-card glass-panel">
            <span className="muted-label">Avg watch time</span>
            <strong>{mainVideo.avgWatchDuration}s</strong>
            <small>Best-performing short-form content</small>
          </div>
          <div className="feature-card glass-panel">
            <span className="muted-label">Est. revenue</span>
            <strong>{formatCurrency(mainVideo.estimatedEarnings)}</strong>
            <small>Across current reach window</small>
          </div>
        </section>

        <section id="features" className="feature-grid">
          <div className="feature-copy">
            <span className="eyebrow">Built for creators</span>
            <h2>Everything you need to understand what is working.</h2>
            <p>
              Clean reporting for the metrics that matter most: engagement, retention, growth, and monetization potential.
            </p>
          </div>

          <div className="feature-list glass-panel">
            {featureList.map((feature) => (
              <div key={feature.title} className="list-item">
                <div className={`icon-box ${feature.tone}`}>{feature.symbol}</div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="section-header">
            <span className="eyebrow">Plans</span>
            <h2>Simple pricing for creators at every stage.</h2>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`pricing-card glass-panel ${plan.highlight ? 'highlight' : ''}`}>
                <span className="plan-name">{plan.name}</span>
                <div className="plan-price">{plan.price}</div>
                <p className="plan-subtitle">{plan.subtitle}</p>
                <ul>
                  {plan.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button className={plan.highlight ? 'primary-btn' : 'ghost-btn'}>Choose plan</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

