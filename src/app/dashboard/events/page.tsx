"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertCircle, RefreshCw, Search, Webhook } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface TrackedEvent {
  id: string;
  externalId?: string;
  sessionId: string;
  workflow?: string;
  name: string;
  content: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/events?limit=100", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load events");
      setEvents(body.events);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load events");
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
    return events.filter((event) =>
      [event.name, event.sessionId, event.workflow, event.content, event.externalId]
        .some((value) => value?.toLowerCase().includes(needle))
    );
  }, [events, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Explorer</h1>
          <p className="mt-1 text-xs text-text-secondary">Inspect the operational signals your product sends to Appraise.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh events
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Tracked events" value={events.length.toString()} icon={Activity} />
        <Metric label="Active sessions" value={new Set(events.map((event) => event.sessionId)).size.toString()} icon={Webhook} />
        <Metric label="Workflows" value={new Set(events.map((event) => event.workflow).filter(Boolean)).size.toString()} icon={Activity} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, session, workflow, or content..." className="w-full rounded-xl border border-border-subtle bg-surface-1 py-3 pl-10 pr-4 text-xs outline-none focus:border-accent-blue" />
      </div>

      {error ? <ErrorState message={error} /> : (
        <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead className="border-b border-border-subtle bg-surface-2/60 text-text-secondary">
                <tr><th className="p-4">Event</th><th className="p-4">Session</th><th className="p-4">Workflow</th><th className="p-4">Payload</th><th className="p-4">Received</th></tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((event) => (
                  <tr key={event.id} className="align-top hover:bg-surface-2/40">
                    <td className="p-4"><span className="rounded bg-blue-500/10 px-2 py-1 font-mono text-[10px] text-blue-700">{event.name}</span><div className="mt-2 font-mono text-[10px] text-text-tertiary">{event.id}</div></td>
                    <td className="p-4 font-mono text-[11px] text-slate-950">{event.sessionId}</td>
                    <td className="p-4 font-mono text-[11px] text-text-secondary">{event.workflow || "unscoped"}</td>
                    <td className="max-w-md p-4"><p className="leading-relaxed text-text-secondary">{event.content}</p><p className="mt-2 font-mono text-[10px] text-text-tertiary">{JSON.stringify(event.metadata)}</p></td>
                    <td className="p-4 text-text-tertiary">{timeAgo(event.occurredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && <div className="p-10 text-center text-xs text-text-secondary">No matching events.</div>}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Activity }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><Icon className="h-4 w-4 text-accent-blue" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}
