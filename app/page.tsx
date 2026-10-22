import Link from 'next/link';
import { mockVideoMetrics } from '@/lib/data';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const mainVideo = mockVideoMetrics[0];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">CreatorPulse</p>
            <h1 className="mt-2 text-4xl font-bold">TikTok creator analytics</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full bg-cyan-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            View dashboard
          </Link>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Views</p>
            <h2 className="mt-3 text-3xl font-bold">{formatCompactNumber(mainVideo.views)}</h2>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Engagement</p>
            <h2 className="mt-3 text-3xl font-bold">{mainVideo.engagementRate}%</h2>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">Estimated earnings</p>
            <h2 className="mt-3 text-3xl font-bold">{formatCurrency(mainVideo.estimatedEarnings)}</h2>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">Track creator performance</h3>
            <p className="mt-4 text-slate-300">
              Analyze views, engagement, watch time, and monetization across your TikTok content.
            </p>

            <div className="mt-8">
              <label className="mb-2 block text-sm text-slate-400">TikTok video URL</label>
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
                  placeholder="https://www.tiktok.com/@creator/video/..."
                />
                <button className="rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950">
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">Why creators use it</h3>
            <ul className="mt-5 space-y-4 text-slate-300">
              <li>• Real-time content monitoring</li>
              <li>• Engagement and retention insights</li>
              <li>• Estimated earnings overview</li>
              <li>• Performance trend analysis</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
