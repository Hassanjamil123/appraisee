"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, BarChart3, Building2, Eye, Globe2, KeyRound, Layers3, RefreshCw, Users, Workflow } from "lucide-react";
import { formatLatency, formatNumber } from "@/lib/utils";

interface AdminOverview {
  totals: {
    organizations: number;
    projects: number;
    apiKeys: number;
    events: number;
    memories: number;
    retrievals: number;
    agents: number;
    activeProjects7d: number;
  };
  performance: {
    avgLatencyMs: number;
    retrievals24h: number;
  };
  website: {
    pageViews24h: number;
    pageViews7d: number;
    uniqueVisitors24h: number;
    uniqueVisitors7d: number;
    topPages: Array<{ path: string; views: number; visitors: number }>;
    timeline: Array<{ date: string; pageViews: number; visitors: number }>;
  };
  recentOrganizations: Array<{ id: string; name: string; slug: string; plan: string; createdAt: string }>;
  recentProjects: Array<{ id: string; name: string; plan: string; organizationId: string; createdAt: string }>;
}

export default function AdminOverviewClient() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/overview", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load admin overview");
      setData(body);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load admin overview");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const cards = data ? [
    { label: "Organizations", value: formatNumber(data.totals.organizations), icon: Building2, hint: `${formatNumber(data.totals.projects)} projects total` },
    { label: "API keys", value: formatNumber(data.totals.apiKeys), icon: KeyRound, hint: `${formatNumber(data.totals.activeProjects7d)} active projects in 7d` },
    { label: "Events", value: formatNumber(data.totals.events), icon: Activity, hint: `${formatNumber(data.totals.memories)} memories derived` },
    { label: "Retrievals", value: formatNumber(data.totals.retrievals), icon: Layers3, hint: `avg latency ${formatLatency(data.performance.avgLatencyMs)}` },
    { label: "Website visitors (7d)", value: formatNumber(data.website.uniqueVisitors7d), icon: Globe2, hint: `${formatNumber(data.website.pageViews7d)} page views` },
    { label: "Agents", value: formatNumber(data.totals.agents), icon: Workflow, hint: `${formatNumber(data.performance.retrievals24h)} retrievals in 24h` },
  ] : [];

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="mt-1 text-xs text-text-secondary">Internal operator view across workspaces, traffic, retrievals, and website visitors.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-1 px-3 py-2 text-xs font-semibold hover:bg-surface-2">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {cards.map(({ label, value, icon: Icon, hint }) => (
              <div key={label} className="rounded-xl border border-border-subtle bg-surface-1 p-5">
                <Icon className="h-4 w-4 text-accent-blue" />
                <p className="mt-4 text-2xl font-bold">{value}</p>
                <p className="mt-1 text-xs font-semibold">{label}</p>
                <p className="mt-1 text-[10px] text-text-tertiary">{hint}</p>
              </div>
            ))}
          </div>

          {data && (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-accent-blue" />
                  <h2 className="text-sm font-bold">Website visitors</h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <MetricBlock label="Unique visitors (24h)" value={formatNumber(data.website.uniqueVisitors24h)} />
                  <MetricBlock label="Page views (24h)" value={formatNumber(data.website.pageViews24h)} />
                </div>
                <div className="mt-5 overflow-hidden rounded-xl border border-border-subtle">
                  <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr] bg-surface-2 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-text-tertiary">
                    <span>Page</span>
                    <span>Views</span>
                    <span>Visitors</span>
                  </div>
                  {data.website.topPages.map((page) => (
                    <div key={page.path} className="grid grid-cols-[1.5fr_0.7fr_0.7fr] border-t border-border-subtle px-4 py-3 text-xs">
                      <span className="font-mono text-text-secondary">{page.path}</span>
                      <span>{formatNumber(page.views)}</span>
                      <span>{formatNumber(page.visitors)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent-blue" />
                  <h2 className="text-sm font-bold">Recent organizations</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {data.recentOrganizations.map((org) => (
                    <div key={org.id} className="rounded-lg border border-border-subtle bg-surface-2/50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold">{org.name}</div>
                          <div className="mt-1 font-mono text-[10px] text-text-tertiary">{org.slug}</div>
                        </div>
                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700 capitalize">{org.plan}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-border-subtle bg-surface-1 p-5 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent-blue" />
                  <h2 className="text-sm font-bold">Recent projects</h2>
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle">
                  <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr] bg-surface-2 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-text-tertiary">
                    <span>Project</span>
                    <span>Plan</span>
                    <span>Organization</span>
                  </div>
                  {data.recentProjects.map((project) => (
                    <div key={project.id} className="grid grid-cols-[1.2fr_0.8fr_0.8fr] border-t border-border-subtle px-4 py-3 text-xs">
                      <span className="font-semibold text-text-secondary">{project.name}</span>
                      <span className="capitalize">{project.plan}</span>
                      <span className="font-mono text-text-tertiary">{project.organizationId}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-2 p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</div>
      <div className="mt-2 text-xl font-bold">{value}</div>
    </div>
  );
}
