"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, BarChart3, Brain, Activity, Timer } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatLatency, formatNumber } from "@/lib/utils";

interface StatsResponse {
  totalMemories: number;
  activeMemories: number;
  totalEntities: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalAgents: number;
  apiCallsToday: number;
  avgLatencyMs: number;
  topWorkflows: Array<{ name: string; count: number }>;
}

interface MetricsResponse {
  metrics: Array<{
    date: string;
    memoriesCreated: number;
    apiCalls: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse["metrics"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, metricsResponse] = await Promise.all([
        fetch("/api/appraise/v1/stats", { cache: "no-store" }),
        fetch("/api/appraise/v1/metrics?days=14", { cache: "no-store" }),
      ]);
      const statsBody = await statsResponse.json();
      const metricsBody = await metricsResponse.json();
      if (!statsResponse.ok) throw new Error(statsBody.error?.message || "Unable to load analytics");
      if (!metricsResponse.ok) throw new Error(metricsBody.error?.message || "Unable to load metrics");
      setStats(statsBody);
      setMetrics(metricsBody.metrics || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-xs text-text-secondary">Live project usage, memory growth, and retrieval activity from your Appraise workspace.</p>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total memories" value={stats ? formatNumber(stats.totalMemories) : "—"} icon={Brain} />
        <MetricCard label="Entities" value={stats ? formatNumber(stats.totalEntities) : "—"} icon={Activity} />
        <MetricCard label="API calls today" value={stats ? formatNumber(stats.apiCallsToday) : "—"} icon={BarChart3} />
        <MetricCard label="Average latency" value={stats ? formatLatency(stats.avgLatencyMs) : "—"} icon={Timer} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
          <h2 className="text-sm font-bold">Memory growth</h2>
          <p className="mt-1 text-[11px] text-text-secondary">Memories created in the last 14 days.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="memoriesCreated" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.16} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
          <h2 className="text-sm font-bold">Context requests</h2>
          <p className="mt-1 text-[11px] text-text-secondary">Retrieval volume over the same period.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="apiCalls" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        <h2 className="text-sm font-bold">Top workflows</h2>
        <p className="mt-1 text-[11px] text-text-secondary">Which workflow labels are producing the most memory right now.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(stats?.topWorkflows || []).map((workflow) => (
            <div key={workflow.name} className="rounded-lg bg-surface-2 p-4">
              <p className="font-mono text-[11px] text-slate-950">{workflow.name}</p>
              <p className="mt-2 text-2xl font-bold">{formatNumber(workflow.count)}</p>
              <p className="text-[11px] text-text-secondary">memories</p>
            </div>
          ))}
          {!loading && (stats?.topWorkflows || []).length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-5 text-xs text-text-secondary">
              No workflow data yet. Start sending workflow-tagged events or use the support demo / SDK test app.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Brain }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><Icon className="h-4 w-4 text-accent-blue" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}
