"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { formatLatency, timeAgo } from "@/lib/utils";

interface RetrievalLog {
  id: string;
  query: string;
  userId?: string | null;
  sessionId?: string | null;
  workflow?: string | null;
  resultCount: number;
  latencyMs: number;
  status: string;
  createdAt: string;
}

export default function LogsDashboard() {
  const [logs, setLogs] = useState<RetrievalLog[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/logs?limit=100", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load logs");
      setLogs(body.logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return logs.filter((log) =>
      [log.query, log.userId, log.sessionId, log.workflow, log.status]
        .some((value) => value?.toLowerCase().includes(needle))
    );
  }, [logs, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Context Logs</h1>
          <p className="mt-1 text-xs text-text-secondary">Inspect retrieval requests, latency, and which sessions are asking Appraise for memory.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh logs
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Metric label="Requests" value={logs.length.toString()} />
        <Metric label="Success" value={logs.filter((log) => log.status === "success").length.toString()} />
        <Metric label="Average latency" value={logs.length ? formatLatency(Math.round(logs.reduce((sum, log) => sum + log.latencyMs, 0) / logs.length)) : "0ms"} />
        <Metric label="Sessions" value={new Set(logs.map((log) => log.sessionId).filter(Boolean)).size.toString()} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search query, session, workflow, or status..." className="w-full rounded-xl border border-border-subtle bg-surface-1 py-3 pl-10 pr-4 text-xs outline-none focus:border-accent-blue" />
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-2/60 text-text-secondary">
              <tr><th className="p-4">Query</th><th className="p-4">Session</th><th className="p-4">Workflow</th><th className="p-4">Results</th><th className="p-4">Latency</th><th className="p-4">Status</th><th className="p-4">Created</th></tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-surface-2/40">
                  <td className="p-4"><div className="font-medium text-slate-950">{log.query}</div><div className="mt-1 font-mono text-[10px] text-text-tertiary">{log.id}</div></td>
                  <td className="p-4 font-mono text-[11px] text-text-secondary">{log.sessionId || "—"}</td>
                  <td className="p-4 font-mono text-[11px] text-text-secondary">{log.workflow || "unscoped"}</td>
                  <td className="p-4 text-slate-950">{log.resultCount}</td>
                  <td className="p-4 font-mono text-slate-950">{formatLatency(log.latencyMs)}</td>
                  <td className="p-4"><span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700 capitalize">{log.status}</span></td>
                  <td className="p-4 text-text-tertiary">{timeAgo(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 ? <div className="p-10 text-center text-xs text-text-secondary">No retrieval logs yet. Use the context playground, chatbot lab, or your SDK app to generate some.</div> : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}
