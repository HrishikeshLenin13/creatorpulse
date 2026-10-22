"use client";

import { useState } from 'react';

export function VideoAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    summary: {
      totalViews: number;
      avgEngagement: number;
      estimatedRevenue: number;
    };
    message: string;
  } | null>(null);

  async function handleAnalyze() {
    if (!url.trim()) {
      setError('Please enter a valid TikTok URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? 'Could not analyze the provided URL.');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error while analyzing content.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="analyzer-panel glass-panel">
      <div className="panel-head">
        <div>
          <span className="muted-label">Video analyzer</span>
          <h2>Analyze a creator URL</h2>
        </div>
      </div>

      <div className="input-row">
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.tiktok.com/@creator/video/..."
          aria-label="TikTok URL"
        />
        <button className="primary-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="field-error">{error}</p>}

      {result && (
        <div className="analysis-result">
          <div className="result-metric">
            <span>Views</span>
            <strong>{result.summary.totalViews.toLocaleString()}</strong>
          </div>
          <div className="result-metric">
            <span>Engagement</span>
            <strong>{result.summary.avgEngagement}%</strong>
          </div>
          <div className="result-metric">
            <span>Revenue</span>
            <strong>${result.summary.estimatedRevenue}</strong>
          </div>
        </div>
      )}

      {result && <p className="analysis-message">{result.message}</p>}
    </div>
  );
}
