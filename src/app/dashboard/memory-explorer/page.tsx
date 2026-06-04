"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Brain, Play, Sparkles, Target, Zap } from "lucide-react";

interface Memory { id: string; content: string; type: string; relevanceScore: number; relevanceBreakdown: Record<string, number>; }
interface ContextResult {
  sessionId: string; urgencySignals: string[]; suggestedActions: string[];
  recentMemories: Memory[]; inferredGoals: string[];
  workflowContext?: { currentStage: string; nextExpectedAction: string; blockers: string[] };
}

export default function ContextPlayground() {
  const [sessionId, setSessionId] = useState("acme_candidate_ada_001");
  const [workflow, setWorkflow] = useState("wf_recruiting_001");
  const [intent, setIntent] = useState("should_we_extend_offer");
  const [result, setResult] = useState<ContextResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/appraise/v1/context", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, workflow, intent, maxMemories: 8, maxEntities: 5 }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to build context");
      setResult(body);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to build context"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold tracking-tight">Context Playground</h1><p className="mt-1 text-xs text-text-secondary">See what your AI receives before it reasons, responds, or acts.</p></div>
      <form onSubmit={run} className="grid gap-4 rounded-xl border border-border-subtle bg-surface-1 p-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <Field label="Session ID" value={sessionId} onChange={setSessionId} />
        <Field label="Workflow" value={workflow} onChange={setWorkflow} />
        <Field label="Intent" value={intent} onChange={setIntent} />
        <button className="inline-flex h-[38px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-4 text-xs font-bold" disabled={loading}><Play className="h-3.5 w-3.5" />{loading ? "Building..." : "Build context"}</button>
      </form>
      {error && <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}
      {!result && !error && <div className="rounded-xl border border-dashed border-border-medium bg-surface-1/40 p-14 text-center"><Brain className="mx-auto h-8 w-8 text-accent-blue" /><p className="mt-4 text-sm font-semibold">Run a context request</p><p className="mt-2 text-xs text-text-secondary">Try the seeded Acme candidate to inspect the full flow.</p></div>}
      {result && <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-3"><h2 className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-accent-purple" />Ranked memories</h2>{result.recentMemories.map((memory) => <div key={memory.id} className="rounded-xl border border-border-subtle bg-surface-1 p-4"><div className="flex items-center justify-between gap-4"><span className="rounded bg-surface-2 px-2 py-1 font-mono text-[10px] text-text-secondary">{memory.type}</span><strong className="text-xs text-emerald-700">{Math.round(memory.relevanceScore * 100)}% relevant</strong></div><p className="mt-3 text-xs leading-relaxed text-text-secondary">{memory.content}</p><div className="mt-3 flex flex-wrap gap-2">{Object.entries(memory.relevanceBreakdown).map(([key, value]) => <span key={key} className="rounded bg-surface-2 px-2 py-1 text-[10px] text-text-tertiary">{key}: {Number(value).toFixed(2)}</span>)}</div></div>)}</div>
        <aside className="space-y-4"><Panel title="Urgency signals" icon={Zap} items={result.urgencySignals} /><Panel title="Suggested actions" icon={Target} items={result.suggestedActions} /><Panel title="Inferred goals" icon={Brain} items={result.inferredGoals.slice(0, 5)} />{result.workflowContext && <div className="rounded-xl border border-border-subtle bg-surface-1 p-4"><h3 className="text-xs font-bold">Workflow status</h3><p className="mt-3 text-xs text-text-secondary">Stage: <strong className="text-slate-950">{result.workflowContext.currentStage}</strong></p><p className="mt-2 text-xs text-text-secondary">Next: <strong className="text-slate-950">{result.workflowContext.nextExpectedAction}</strong></p></div>}</aside>
      </div>}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="space-y-2"><span className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-border-subtle bg-surface-2 px-3 py-2.5 text-xs outline-none focus:border-accent-blue" /></label>; }
function Panel({ title, icon: Icon, items }: { title: string; icon: typeof Brain; items: string[] }) { return <div className="rounded-xl border border-border-subtle bg-surface-1 p-4"><h3 className="flex items-center gap-2 text-xs font-bold"><Icon className="h-3.5 w-3.5 text-accent-blue" />{title}</h3><div className="mt-3 space-y-2">{items.length ? items.map((item) => <div key={item} className="rounded-lg bg-surface-2 px-3 py-2 text-[11px] text-text-secondary">{item.replaceAll("_", " ")}</div>) : <p className="text-[11px] text-text-tertiary">None detected</p>}</div></div>; }
