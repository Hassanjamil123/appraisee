"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, GitBranch, Plus, RefreshCw } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Workflow {
  id: string;
  name: string;
  description?: string | null;
  stages: string[];
  activeStage?: string | null;
  priority?: number | null;
  config?: Record<string, unknown>;
}

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  positionX: number;
  positionY: number;
  connections?: string[];
}

interface EventItem {
  id: string;
  workflow?: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedNodes, setSelectedNodes] = useState<WorkflowNode[]>([]);
  const [observedCounts, setObservedCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [workflowsResponse, eventsResponse] = await Promise.all([
        fetch("/api/appraise/v1/workflows", { cache: "no-store" }),
        fetch("/api/appraise/v1/events?limit=200", { cache: "no-store" }),
      ]);
      const workflowsBody = await workflowsResponse.json();
      const eventsBody = await eventsResponse.json();
      if (!workflowsResponse.ok) throw new Error(workflowsBody.error?.message || "Unable to load workflows");
      if (!eventsResponse.ok) throw new Error(eventsBody.error?.message || "Unable to load events");

      const nextWorkflows: Workflow[] = workflowsBody.workflows || [];
      setWorkflows(nextWorkflows);
      setSelectedId((current) => current || nextWorkflows[0]?.id || "");

      const counts: Record<string, number> = {};
      for (const event of (eventsBody.events || []) as EventItem[]) {
        if (!event.workflow) continue;
        counts[event.workflow] = (counts[event.workflow] || 0) + 1;
      }
      setObservedCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workflows");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSelectedWorkflow = useCallback(async (id: string) => {
    if (!id) {
      setSelectedNodes([]);
      return;
    }

    try {
      const response = await fetch(`/api/appraise/v1/workflows/${id}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load workflow details");
      setSelectedNodes(body.nodes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workflow details");
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  useEffect(() => {
    void loadSelectedWorkflow(selectedId);
  }, [selectedId, loadSelectedWorkflow]);

  async function createWorkflow() {
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Workflow ${workflows.length + 1}`,
          description: "New workflow",
          stages: ["ingest", "retrieve", "respond"],
          activeStage: "ingest",
          config: { nextAction: "track first event" },
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to create workflow");
      await load();
      setSelectedId(body.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create workflow");
    } finally {
      setCreating(false);
    }
  }

  const selectedWorkflow = useMemo(
    () => workflows.find((workflow) => workflow.id === selectedId) || null,
    [workflows, selectedId]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="mt-1 text-xs text-text-secondary">Configured workflow records plus observed workflow activity coming in from your events.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => void createWorkflow()} disabled={creating} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
            <Plus className="h-3.5 w-3.5" />
            {creating ? "Creating..." : "Create workflow"}
          </button>
        </div>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Configured workflows" value={workflows.length.toString()} />
        <Metric label="Observed workflow labels" value={Object.keys(observedCounts).length.toString()} />
        <Metric label="Selected nodes" value={selectedNodes.length.toString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="rounded-xl border border-border-subtle bg-surface-1 p-4">
          <h2 className="text-sm font-bold">Workflow list</h2>
          <div className="mt-4 space-y-3">
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => setSelectedId(workflow.id)}
                className={`w-full rounded-lg border p-4 text-left transition-all ${workflow.id === selectedId ? "border-accent-blue bg-blue-500/5" : "border-border-subtle bg-surface-2 hover:bg-surface-3"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-950">{workflow.name}</p>
                    <p className="mt-1 font-mono text-[10px] text-text-tertiary">{workflow.id}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-text-tertiary" />
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-text-secondary">
                  <span>{workflow.activeStage || "no active stage"}</span>
                  <span>{formatNumber(observedCounts[workflow.id] || 0)} events</span>
                </div>
              </button>
            ))}
            {!loading && workflows.length === 0 ? <div className="rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-5 text-xs text-text-secondary">No workflow records yet. Create one here, or keep using raw workflow strings from your app until you want a richer model.</div> : null}
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
          {selectedWorkflow ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{selectedWorkflow.name}</h2>
                  <p className="mt-1 text-xs text-text-secondary">{selectedWorkflow.description || "No description yet."}</p>
                </div>
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700">
                  {selectedWorkflow.activeStage || "active"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedWorkflow.stages.map((stage) => (
                  <span key={stage} className={`rounded px-2 py-1 text-[10px] ${stage === selectedWorkflow.activeStage ? "bg-accent-blue text-white" : "bg-surface-2 text-text-tertiary"}`}>
                    {stage}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-surface-2 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-text-tertiary">Observed event count</p>
                  <p className="mt-2 text-2xl font-bold">{formatNumber(observedCounts[selectedWorkflow.id] || 0)}</p>
                </div>
                <div className="rounded-lg bg-surface-2 p-4">
                  <p className="text-[10px] uppercase tracking-wide text-text-tertiary">Next action</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{String(selectedWorkflow.config?.nextAction || "not configured")}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold">Workflow nodes</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {selectedNodes.map((node) => (
                    <div key={node.id} className="rounded-lg border border-border-subtle bg-surface-2 p-4">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-3.5 w-3.5 text-accent-blue" />
                        <span className="text-xs font-bold text-slate-950">{node.label}</span>
                      </div>
                      <p className="mt-2 font-mono text-[10px] text-text-tertiary">{node.type}</p>
                      <p className="mt-3 text-[11px] text-text-secondary">{(node.connections || []).length} outgoing connections</p>
                    </div>
                  ))}
                  {selectedNodes.length === 0 ? <div className="rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-5 text-xs text-text-secondary">No nodes added yet. This workflow exists as a real record, but its visual pipeline hasn’t been modeled yet.</div> : null}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-8 text-center text-xs text-text-secondary">
              Select a workflow to inspect it.
            </div>
          )}
        </section>
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
