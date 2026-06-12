"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, PauseCircle, PlayCircle, PlugZap, RefreshCw, Settings2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";

type ConnectorStatus = "requested" | "configured" | "active" | "paused" | "error";

type CatalogItem = {
  provider: string;
  name: string;
  description: string;
  category: string;
  syncMode: string;
  availability: string;
};

type Connector = {
  id: string;
  provider: string;
  name: string;
  description?: string | null;
  category?: string | null;
  syncMode: string;
  status: ConnectorStatus;
  stats?: Record<string, unknown> | null;
  lastSyncedAt?: string | null;
  lastError?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
};

const badgeClassNames = {
  available: "bg-emerald-50 text-emerald-700 border-emerald-100",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  configured: "bg-blue-50 text-blue-700 border-blue-100",
  requested: "bg-amber-50 text-amber-700 border-amber-100",
  paused: "bg-slate-100 text-slate-600 border-slate-200",
  error: "bg-red-50 text-red-700 border-red-100",
  requestable: "bg-slate-100 text-slate-600 border-slate-200",
} as const;

export default function ConnectorsPage() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyProvider, setBusyProvider] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/connectors", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load connectors");
      setCatalog(body.catalog || []);
      setConnectors(body.connectors || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load connectors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const connectorsByProvider = useMemo(() => {
    return new Map(connectors.map((connector) => [connector.provider, connector]));
  }, [connectors]);

  async function createConnector(provider: string) {
    setBusyProvider(provider);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/connectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to create connector");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create connector");
    } finally {
      setBusyProvider("");
    }
  }

  async function updateStatus(connector: Connector, status: ConnectorStatus) {
    setUpdatingId(connector.id);
    setError("");
    try {
      const payload: Record<string, unknown> = { status };
      if (status === "active") {
        payload.lastSyncedAt = new Date().toISOString();
        payload.stats = {
          ...(connector.stats || {}),
          lastCheckedAt: new Date().toISOString(),
        };
      }
      const response = await fetch("/api/appraise/v1/connectors/" + connector.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to update connector");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update connector");
    } finally {
      setUpdatingId("");
    }
  }

  const activeCount = connectors.filter((connector) => connector.status === "active").length;
  const requestedCount = connectors.filter((connector) => connector.status === "requested").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Connectors</h1>
          <p className="mt-1 text-xs text-text-secondary">Register the systems you want Appraise to pull memory from, and keep the workspace honest about what is live today versus what is queued next.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3">
            <RefreshCw className={"h-3.5 w-3.5" + (loading ? " animate-spin" : "")} />
            Refresh
          </button>
          <a href="/docs#track-api" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-2 text-xs font-bold text-white">
            Start with events
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Active connectors" value={activeCount.toString()} />
        <Metric label="Requested connectors" value={requestedCount.toString()} />
        <Metric label="Connector templates" value={catalog.length.toString()} />
      </div>

      <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Connector catalog</h2>
            <p className="mt-1 text-xs text-text-secondary">Custom events are live now. Managed connectors can be claimed in the workspace today so your setup path and rollout plan stay visible.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((item) => {
            const connector = connectorsByProvider.get(item.provider);
            const badgeKey = connector ? connector.status : item.availability === "available_now" ? "available" : "requestable";
            const badgeLabel = connector ? connector.status : item.availability === "available_now" ? "Available now" : "Request in console";
            const busy = busyProvider === item.provider || updatingId === connector?.id;
            return (
              <article key={item.provider} className="rounded-xl border border-border-subtle bg-surface-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PlugZap className="h-4 w-4 text-accent-blue" />
                    <div>
                      <p className="text-sm font-bold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-text-tertiary">{item.category}</p>
                    </div>
                  </div>
                  <span className={"rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] " + badgeClassNames[badgeKey as keyof typeof badgeClassNames]}>{badgeLabel}</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">{item.description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Stat label="Sync mode" value={item.syncMode} />
                  <Stat label="Workspace state" value={connector ? connector.status : "not added"} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {!connector ? (
                    <button onClick={() => void createConnector(item.provider)} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60">
                      <Settings2 className="h-3.5 w-3.5" />
                      {busy ? "Saving..." : item.provider === "custom_events" ? "Add connector" : "Request connector"}
                    </button>
                  ) : (
                    <button onClick={() => void updateStatus(connector, nextStatus(connector.status))} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60">
                      {connector.status === "active" ? <PauseCircle className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}
                      {busy ? "Updating..." : actionLabel(connector.status)}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        <h2 className="text-sm font-bold text-slate-950">Workspace connectors</h2>
        <p className="mt-1 text-xs text-text-secondary">A real record of what this workspace is using right now versus what is still on deck.</p>
        {loading ? (
          <div className="mt-4 rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-8 text-center text-xs text-text-secondary">Loading connectors…</div>
        ) : connectors.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border-medium bg-surface-2/50 p-8 text-center text-xs text-text-secondary">No connectors yet. Add custom events to reflect today’s live integration path, or request a managed connector to line up what comes next.</div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {connectors.map((connector) => (
              <div key={connector.id} className="rounded-xl border border-border-subtle bg-surface-2 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-950">{connector.name}</p>
                    <p className="mt-1 font-mono text-[10px] text-text-tertiary">{connector.id}</p>
                  </div>
                  <span className={"rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] " + badgeClassNames[connector.status]}>{connector.status}</span>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-text-secondary">{guidanceFor(connector)}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Stat label="Provider" value={connector.provider} mono />
                  <Stat label="Sync mode" value={connector.syncMode} />
                  <Stat label="Last sync" value={connector.lastSyncedAt ? timeAgo(connector.lastSyncedAt) : "not synced yet"} />
                  <Stat label="Updated" value={connector.updatedAt ? timeAgo(connector.updatedAt) : "just now"} />
                </div>
                {connector.lastError ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700">{connector.lastError}</p> : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function nextStatus(status: ConnectorStatus): ConnectorStatus {
  if (status === "requested") return "configured";
  if (status === "configured") return "active";
  if (status === "active") return "paused";
  if (status === "paused") return "active";
  return "active";
}

function actionLabel(status: ConnectorStatus) {
  if (status === "requested") return "Mark configured";
  if (status === "configured") return "Activate";
  if (status === "active") return "Pause";
  if (status === "paused") return "Reactivate";
  return "Retry";
}

function guidanceFor(connector: Connector) {
  if (connector.provider === "custom_events") {
    return "This is the live path today: send product events with the SDK or REST API and use this connector record as the workspace anchor for that integration.";
  }
  return "This managed connector is now tracked in the workspace, but native sync is still staged. Keep using direct events or the SDK while Appraise closes the loop on first-party sync.";
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="rounded-lg bg-white px-3 py-3"><p className="text-[10px] uppercase tracking-wide text-text-tertiary">{label}</p><p className={"mt-1 text-xs font-semibold text-slate-950" + (mono ? " font-mono" : "")}>{value}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}
