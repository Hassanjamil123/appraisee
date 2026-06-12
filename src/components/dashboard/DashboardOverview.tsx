"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Brain, Cable, GitBranch, KeyRound, RefreshCw, Search, Server, Timer } from "lucide-react";
import { formatLatency, formatNumber, formatStorage } from "@/lib/utils";

interface Stats {
  totalMemories: number;
  activeMemories: number;
  totalEntities: number;
  totalWorkflows: number;
  activeWorkflows: number;
  apiCallsToday: number;
  avgLatencyMs: number;
  topWorkflows: Array<{ name: string; count: number }>;
}

interface Workflow {
  id: string;
  name: string;
  activeStage?: string;
  stages: string[];
  config?: { nextAction?: string; blockers?: string[] };
}

interface ProjectSnapshot {
  project?: { name?: string; plan?: string };
  usage?: {
    storageMbUsed: number;
    storageLimitMb: number;
    storagePercent: number;
    monthlyRequestsTotal: number;
    monthlyRequestLimit: number;
    monthlyRequestsPercent: number;
  } | null;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [project, setProject] = useState<ProjectSnapshot | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, workflowsResponse, projectResponse] = await Promise.all([
        fetch("/api/appraise/v1/stats", { cache: "no-store" }),
        fetch("/api/appraise/v1/workflows", { cache: "no-store" }),
        fetch("/api/appraise/v1/projects/current", { cache: "no-store" }),
      ]);
      const statsBody = await statsResponse.json();
      const workflowsBody = await workflowsResponse.json();
      const projectBody = await projectResponse.json();
      if (!statsResponse.ok) throw new Error(statsBody.error?.message || "Unable to load dashboard");
      if (!workflowsResponse.ok) throw new Error(workflowsBody.error?.message || "Unable to load workflows");
      if (!projectResponse.ok) throw new Error(projectBody.error?.message || "Unable to load project");
      setStats(statsBody);
      setWorkflows(workflowsBody.workflows);
      setProject(projectBody);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const cards = stats
    ? [
        { label: "Active memories", value: formatNumber(stats.activeMemories), icon: Brain, hint: `${stats.totalMemories} indexed total` },
        { label: "Context requests today", value: formatNumber(stats.apiCallsToday), icon: Search, hint: "retrieval API calls" },
        { label: "Average latency", value: formatLatency(stats.avgLatencyMs), icon: Timer, hint: "context retrieval" },
      ]
    : [];

  const quickActions = [
    { href: "/dashboard/quickstart", label: "Start integration", copy: "Get to a first working SDK call.", icon: ArrowRight },
    { href: "/dashboard/api-keys", label: "Create API key", copy: "Generate credentials for your app.", icon: KeyRound },
    { href: "/dashboard/connectors", label: "Manage connectors", copy: "Keep custom events and managed connectors organized.", icon: Cable },
    { href: "/dashboard/memory-explorer", label: "Inspect context", copy: "See exactly what Appraise would retrieve right now.", icon: Search },
  ];

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Developer Console</h1>
          <p className="mt-1 text-sm text-text-secondary">A simpler home for your integration: get set up, inspect context, and keep an eye on memory health.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs font-semibold text-emerald-700">
            <Server className="h-3.5 w-3.5" />
            Backend connected
          </span>
          <button onClick={() => void load()} className="rounded-lg border border-border-subtle bg-surface-2 p-2 hover:bg-surface-3">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      {error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map(({ label, value, icon: Icon, hint }) => (
              <div key={label} className="rounded-xl border border-border-subtle bg-surface-1 p-5">
                <Icon className="h-4 w-4 text-accent-blue" />
                <p className="mt-4 text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs font-semibold">{label}</p>
                <p className="mt-1 text-[10px] text-text-tertiary">{hint}</p>
              </div>
            ))}
          </div>
          <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
            <div>
              <h2 className="text-sm font-bold">Start here</h2>
              <p className="mt-1 text-xs text-text-secondary">The most common tasks developers need in the first few minutes.</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickActions.map(({ href, label, copy, icon: Icon }) => (
                <Link key={href} href={href} className="rounded-xl border border-border-subtle bg-surface-2 p-4 transition hover:bg-surface-3">
                  <Icon className="h-4 w-4 text-accent-blue" />
                  <p className="mt-4 text-sm font-bold text-slate-950">{label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">{copy}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Workflows</h2>
                <Link href="/dashboard/workflows" className="flex items-center gap-1 text-[11px] text-accent-blue">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {workflows.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-5 text-xs text-text-secondary">
                    No workflows yet. You can still use Appraise with raw workflow labels, then model them more formally when the product flow is clearer.
                  </div>
                ) : workflows.map((workflow) => (
                  <div key={workflow.id} className="rounded-lg border border-border-subtle bg-surface-2/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">{workflow.name}</p>
                        <p className="mt-1 font-mono text-[10px] text-text-tertiary">{workflow.id}</p>
                      </div>
                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700">
                        {workflow.activeStage || "active"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {workflow.stages.map((stage) => (
                        <span
                          key={stage}
                          className={`rounded px-2 py-1 text-[10px] ${
                            stage === workflow.activeStage ? "bg-accent-blue text-white" : "bg-surface-3 text-text-tertiary"
                          }`}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <div className="space-y-6">
              <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold">Plan and usage</h2>
                    <p className="mt-1 text-[11px] text-text-secondary">
                      {project?.project?.name || "Your workspace"} is on the <span className="capitalize">{project?.project?.plan || "starter"}</span> plan.
                    </p>
                  </div>
                  <Link href="/dashboard/billing" className="flex items-center gap-1 text-[11px] text-accent-blue">
                    Billing <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-5 space-y-4">
                  <MiniUsageBar
                    label="Monthly requests"
                    value={project?.usage ? `${formatNumber(project.usage.monthlyRequestsTotal)} / ${formatNumber(project.usage.monthlyRequestLimit)}` : "Waiting for data"}
                    percent={project?.usage?.monthlyRequestsPercent ?? 0}
                  />
                  <MiniUsageBar
                    label="Storage"
                    value={project?.usage ? `${formatStorage(project.usage.storageMbUsed)} / ${formatStorage(project.usage.storageLimitMb)}` : "Waiting for data"}
                    percent={project?.usage?.storagePercent ?? 0}
                  />
                </div>
              </section>
              <section className="rounded-xl border border-border-subtle bg-gradient-to-b from-surface-1 to-blue-500/5 p-5">
                <h2 className="text-sm font-bold">What Appraise is doing</h2>
                <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                  Your app sends events, Appraise shapes them into memory, and your model gets back a smaller context window before it replies.
                </p>
                <div className="mt-5 space-y-3 text-[11px]">
                  <Step number="1" label="Track events from your product" />
                  <Step number="2" label="Retrieve only the context that matters" />
                  <Step number="3" label="Feed that into your model" />
                </div>
                <Link
                  href="/dashboard/memory-explorer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-2.5 text-xs font-bold text-white"
                >
                  Open context explorer <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-2 p-3">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-700">
        {number}
      </span>
      <span className="text-text-secondary">{label}</span>
    </div>
  );
}

function MiniUsageBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-text-secondary">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-accent-blue transition-all" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
      </div>
    </div>
  );
}
