"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { mockSeries } from '@/lib/data';

export function PerformanceChart() {
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockSeries} margin={{ top: 20, right: 10, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="reachFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: 12,
              color: '#f8fafc',
            }}
          />
          <Area
            type="monotone"
            dataKey="reach"
            stroke="#67e8f9"
            strokeWidth={3}
            fill="url(#reachFill)"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
