"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { retrievalGrowthData, agentInteractionsData, userMemoryActivityData } from "@/lib/mock-data";
import { Brain, Zap, Target, HelpCircle } from "lucide-react";

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Analytics</h1>
        <p className="text-xs text-text-secondary mt-1">
          Detailed metrics for workflow context and API call operations.
        </p>
      </div>

      {/* Grid top statistics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary font-medium">Monthly API Volume</span>
            <h3 className="text-xl font-bold text-slate-950 mt-1">12,584,201</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary font-medium">Context Growth Index</span>
            <h3 className="text-xl font-bold text-slate-950 mt-1">+24.3%</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary font-medium">Context Precision Range</span>
            <h3 className="text-xl font-bold text-slate-950 mt-1">97.3%</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-700">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Large area graph */}
        <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex flex-col">
          <h3 className="text-sm font-bold text-slate-950 mb-6">Context Growth (KB)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retrievalGrowthData}>
                <defs>
                  <linearGradient id="glowPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#glowPurple)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small line graph */}
        <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex flex-col">
          <h3 className="text-sm font-bold text-slate-950 mb-6">Latency Trends (ms)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agentInteractionsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    borderColor: "rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
