import { mockVideoMetrics } from '@/lib/data';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">CreatorPulse</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
          </div>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {mockVideoMetrics.map((video) => (
            <div key={video.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-400">{video.title}</p>
              <p className="mt-3 text-2xl font-bold">{formatCompactNumber(video.views)}</p>
              <p className="mt-2 text-cyan-400">{formatCurrency(video.estimatedEarnings)}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Recent content performance</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 pr-6">Video</th>
                  <th className="pb-3 pr-6">Views</th>
                  <th className="pb-3 pr-6">Likes</th>
                  <th className="pb-3 pr-6">Comments</th>
                  <th className="pb-3 pr-6">Shares</th>
                  <th className="pb-3 pr-6">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {mockVideoMetrics.map((video) => (
                  <tr key={video.id} className="border-t border-slate-800">
                    <td className="py-3 pr-6">{video.title}</td>
                    <td className="py-3 pr-6">{formatCompactNumber(video.views)}</td>
                    <td className="py-3 pr-6">{formatCompactNumber(video.likes)}</td>
                    <td className="py-3 pr-6">{formatCompactNumber(video.comments)}</td>
                    <td className="py-3 pr-6">{formatCompactNumber(video.shares)}</td>
                    <td className="py-3 pr-6">{video.engagementRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
