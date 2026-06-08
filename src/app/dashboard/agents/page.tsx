"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Bot, Cpu, Plus, RefreshCw } from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  workflowIds?: string[];
  config?: Record<string, unknown>;
  lastActiveAt?: string | null;
  memoryCount?: number | null;
}

export default function AgentsDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/agents", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load agents");
      setAgents(body.agents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load agents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  async function createAgent() {
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Agent ${agents.length + 1}`,
          description: "General-purpose Appraise agent",
          config: { model: "gpt-4o-mini" },
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to create agent");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create agent");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="mt-1 text-xs text-text-secondary">Register the assistants, copilots, and internal bots that use Appraise memory.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => void createAgent()} disabled={creating} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
            <Plus className="h-3.5 w-3.5" />
            {creating ? "Creating..." : "Create agent"}
          </button>
        </div>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Registered agents" value={agents.length.toString()} icon={Bot} />
        <Metric label="Active agents" value={agents.filter((agent) => agent.status === "active").length.toString()} icon={Cpu} />
        <Metric label="Recent activity" value={agents.filter((agent) => agent.lastActiveAt).length.toString()} icon={RefreshCw} />
      </div>

      {loading ? (
        <EmptyCard label="Loading agents..." />
      ) : agents.length === 0 ? (
        <EmptyCard label="No agents yet. Create your first agent to attach workflows and model config." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {agents.map((agent) => (
            <div key={agent.id} className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">{agent.name}</p>
                  <p className="mt-1 font-mono text-[10px] text-text-tertiary">{agent.id}</p>
                </div>
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700 capitalize">
                  {agent.status}
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-text-secondary">{agent.description || "No description yet."}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Stat label="Workflows" value={(agent.workflowIds?.length || 0).toString()} />
                <Stat label="Tracked memories" value={String(agent.memoryCount || 0)} />
                <Stat label="Model" value={String(agent.config?.model || "not set")} mono />
                <Stat label="Last active" value={agent.lastActiveAt ? timeAgo(agent.lastActiveAt) : "never"} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Bot }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><Icon className="h-4 w-4 text-accent-blue" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="rounded-lg bg-surface-2 px-3 py-3"><p className="text-[10px] uppercase tracking-wide text-text-tertiary">{label}</p><p className={`mt-1 text-xs font-semibold text-slate-950 ${mono ? "font-mono" : ""}`}>{value}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}

function EmptyCard({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-border-medium bg-surface-1/40 p-12 text-center text-xs text-text-secondary">{label}</div>;
}
