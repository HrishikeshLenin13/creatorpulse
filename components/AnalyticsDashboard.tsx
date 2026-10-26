"use client";

import { useMemo, useState } from 'react';
import { formatCompactNumber, formatCurrency } from '@/lib/utils';
import { mockVideoMetrics, revenueSources } from '@/lib/data';
import { summarizePosts } from '@/lib/post-tools';
import { exportPostsCsv } from '@/lib/export';

export function AnalyticsDashboard() {
  const [selectedSegment, setSelectedSegment] = useState<'Overview' | 'Posts' | 'Audience' | 'Revenue'>('Overview');
  const [filter, setFilter] = useState<'7D' | '30D' | '90D'>('30D');

  const stats = useMemo(
    () => {
      const summary=summarizePosts(mockVideoMetrics);
      return [
        {label:'Total views',value:formatCompactNumber(summary.totalViews)},
        {label:'Avg engagement',value:summary.engagementRate.toFixed(1)+'%'},
        {label:'Watch time',value:summary.watchTimeHours.toFixed(1)+'h'},
        {label:'Est. earnings',value:formatCurrency(summary.estimatedRevenue)},
      ];
    },
    [],
  );

  function downloadPosts() {
    const url = URL.createObjectURL(new Blob([exportPostsCsv(mockVideoMetrics)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'creatorpulse-demo-posts.csv';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="workspace-shell">
      <div className="workspace-toolbar glass-panel">
        <div className="toolbar-left">
          <div className="workspace-badge">Demo data</div>
          <span className="muted-label">Creator workspace</span>
        </div>

        <div className="toolbar-tabs">
          {['Overview', 'Posts', 'Audience', 'Revenue'].map((tab) => (
            <button
              key={tab}
              className={selectedSegment === tab ? 'tab active' : 'tab'}
              onClick={() => setSelectedSegment(tab as any)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="toolbar-actions">
          <select value={filter} onChange={(event) => setFilter(event.target.value as any)}>
            <option value="7D">7D</option>
            <option value="30D">30D</option>
            <option value="90D">90D</option>
          </select>
          <button type="button" className="primary-btn small-btn" onClick={downloadPosts}>Export CSV</button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card glass-panel">
            <span className="muted-label">{stat.label}</span>
            <div className="stat-row">
              <strong>{stat.value}</strong>

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

          <div className="trend-panel">
            <div className="trend-bars">
              {[82, 64, 74, 91, 68, 88, 94].map((value, idx) => (
                <div key={idx} className="bar-cluster">
                  <div className="bar-track">
                    <span style={{ height: `${value}%` }} />
                  </div>
                  <small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel glass-panel side-panel">
          <div className="panel-head">
            <div>
              <span className="muted-label">Revenue mix</span>
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

      <div className="bottom-strip">
        <div className="mini-panel glass-panel">
          <span className="muted-label">Avg watch time</span>
          <strong>{mockVideoMetrics[0].avgWatchDuration}s</strong>
          <small>Best format: storytelling + voiceover</small>
        </div>
        <div className="mini-panel glass-panel">
          <span className="muted-label">Predicted revenue</span>
          <strong>{formatCurrency(2860)}</strong>
          <small>Projected from current content velocity</small>
        </div>
      </div>
    </div>
  );
}
