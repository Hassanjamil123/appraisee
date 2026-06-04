"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clipboard,
  Loader2,
  MessageSquare,
  Send,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

type ChatbotType = "customer_support" | "sales" | "healthcare" | "recruiting" | "general";

interface Memory {
  id: string;
  content: string;
  relevanceScore: number;
}

interface CompareResult {
  withoutAppraise: {
    response: string;
    reasoning: string;
    provider: string;
    model: string;
  };
  withAppraise: {
    response: string;
    reasoning: string;
    usedMemories: number;
    suggestedActions: string[];
    urgencySignals: string[];
    provider: string;
    model: string;
  };
  context: {
    recentMemories?: Memory[];
    urgencySignals?: string[];
    suggestedActions?: string[];
    inferredGoals?: string[];
  };
  stored?: {
    eventId?: string;
    memoryId?: string;
  } | null;
  request: {
    type: ChatbotType;
    sessionId: string;
    workflow?: string;
    message: string;
    intent: string;
  };
}

interface ConversationTurn {
  id: string;
  userMessage: string;
  withoutAppraise: {
    response: string;
    provider: string;
    model: string;
  };
  withAppraise: {
    response: string;
    provider: string;
    model: string;
    usedMemories: number;
  };
}

const presets = [
  {
    label: "Ecommerce support",
    type: "customer_support" as const,
    sessionId: "real_chatbot_customer_001",
    workflow: "customer_support",
    message: "Where is my order? This is getting annoying. I already asked yesterday.",
  },
  {
    label: "Sales assistant",
    type: "sales" as const,
    sessionId: "example_sales_nova_001",
    workflow: "sales_pipeline",
    message: "Should I send pricing now or wait for the security review?",
  },
  {
    label: "Healthcare intake",
    type: "healthcare" as const,
    sessionId: "example_healthcare_maya_001",
    workflow: "clinical_triage",
    message: "I still feel tightness. Should this be escalated?",
  },
  {
    label: "Recruiting agent",
    type: "recruiting" as const,
    sessionId: "example_recruiting_sarah_001",
    workflow: "recruiting_pipeline",
    message: "Should we extend an offer or run one more interview?",
  },
];

export default function ChatbotsPage() {
  const [type, setType] = useState<ChatbotType>("customer_support");
  const [sessionId, setSessionId] = useState("real_chatbot_customer_001");
  const [workflow, setWorkflow] = useState("customer_support");
  const [message, setMessage] = useState("Where is my order? This is getting annoying. I already asked yesterday.");
  const [result, setResult] = useState<CompareResult | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);

  function applyPreset(preset: (typeof presets)[number]) {
    setType(preset.type);
    setSessionId(preset.sessionId);
    setWorkflow(preset.workflow);
    setMessage(preset.message);
    setResult(null);
    setConversation([]);
    setError("");
    setStatus("");
  }

  async function compareBots() {
    setLoading(true);
    setError("");
    setStatus("Running stateless and Appraise-powered chatbots side by side...");

    try {
      const response = await fetch("/api/appraise/v1/chatbots/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          sessionId,
          workflow,
          message,
          metadata: workflow === "customer_support" ? { orderId: "ORD-8842" } : {},
          maxMemories: 8,
          maxEntities: 5,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to compare chatbot responses");
      setResult(body);
      setConversation((current) => [
        ...current,
        {
          id: `${Date.now()}_${current.length}`,
          userMessage: body.request.message,
          withoutAppraise: {
            response: body.withoutAppraise.response,
            provider: body.withoutAppraise.provider,
            model: body.withoutAppraise.model,
          },
          withAppraise: {
            response: body.withAppraise.response,
            provider: body.withAppraise.provider,
            model: body.withAppraise.model,
            usedMemories: body.withAppraise.usedMemories,
          },
        },
      ]);
      setStatus("Comparison ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to compare chatbot responses");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function copyJson() {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function resetConversation() {
    setConversation([]);
    setResult(null);
    setStatus("Conversation reset. Keep the same preset or start a new session.");
    setError("");
  }

  const memories = result?.context.recentMemories ?? [];
  const urgencySignals = result?.context.urgencySignals ?? [];
  const suggestedActions = result?.context.suggestedActions ?? [];
  const inferredGoals = result?.context.inferredGoals ?? [];

  return (
    <div className="space-y-7 animate-fade-in">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Bot className="h-4 w-4" />
              Chatbot lab
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
              Compare one chatbot without Appraise and one with Appraise.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              This is a dedicated comparison workspace for a real chatbot flow. Both sides receive the same message. One replies statelessly, and the other retrieves Appraise context first.
            </p>
          </div>
          <button
            onClick={compareBots}
            disabled={loading || !message.trim() || !sessionId.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Compare bots
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => applyPreset(preset)}
            className={`rounded-2xl border p-4 text-left transition ${
              type === preset.type && sessionId === preset.sessionId
                ? "border-blue-300 bg-blue-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-bold text-slate-950">{preset.label}</p>
            <p className="mt-2 font-mono text-[10px] text-slate-400">{preset.workflow}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Comparison request
          </h2>
          <Field label="Type">
            <select
              value={type}
              onChange={(event) => setType(event.target.value as ChatbotType)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="customer_support">Customer support</option>
              <option value="sales">Sales</option>
              <option value="healthcare">Healthcare</option>
              <option value="recruiting">Recruiting</option>
              <option value="general">General</option>
            </select>
          </Field>
          <Field label="Session ID">
            <input value={sessionId} onChange={(event) => setSessionId(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </Field>
          <Field label="Workflow">
            <input value={workflow} onChange={(event) => setWorkflow(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </Field>
          <Field label="Customer message">
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-7 outline-none focus:border-blue-400" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              onClick={compareBots}
              disabled={loading || !message.trim() || !sessionId.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send turn
            </button>
            <button
              onClick={resetConversation}
              disabled={!conversation.length && !result}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900 disabled:opacity-40"
            >
              Reset thread
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {status && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {status}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <BotPanel
              eyebrow="Without Appraise"
              title="Stateless chatbot"
              response={result?.withoutAppraise.response || "Run the comparison to see the stateless response here."}
              reasoning={result?.withoutAppraise.reasoning || "This side only sees the latest user message."}
              provider={result?.withoutAppraise.provider}
              model={result?.withoutAppraise.model}
              tone="slate"
            />
            <BotPanel
              eyebrow="With Appraise"
              title="Contextual chatbot"
              response={result?.withAppraise.response || "Run the comparison to see the Appraise-powered response here."}
              reasoning={result?.withAppraise.reasoning || "This side retrieves Appraise memory before responding."}
              provider={result?.withAppraise.provider}
              model={result?.withAppraise.model}
              tone="blue"
              footer={result ? `${result.withAppraise.usedMemories} memories used` : undefined}
            />
          </div>

          {result?.stored && (
            <p className="font-mono text-[10px] text-slate-500">
              stored event: {result.stored.eventId} · memory: {result.stored.memoryId}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <ContextCard title="Urgency" icon={Zap} items={urgencySignals} />
            <ContextCard title="Actions" icon={Target} items={suggestedActions} />
            <ContextCard title="Goals" icon={Sparkles} items={inferredGoals} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Conversation history</h2>
            <p className="mt-1 text-xs text-slate-600">
              Keep sending turns with the same session to watch the Appraise side build memory while the stateless side stays flat.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {conversation.length} turns
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {conversation.length ? conversation.map((turn, index) => (
            <div key={turn.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Turn {index + 1}
                </span>
                <span className="font-mono text-[10px] text-slate-400">{sessionId}</span>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">User</div>
                <p className="mt-2 text-sm leading-7 text-slate-700">{turn.userMessage}</p>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <HistoryResponseCard
                  title="Without Appraise"
                  response={turn.withoutAppraise.response}
                  provider={turn.withoutAppraise.provider}
                  model={turn.withoutAppraise.model}
                  tone="slate"
                />
                <HistoryResponseCard
                  title="With Appraise"
                  response={turn.withAppraise.response}
                  provider={turn.withAppraise.provider}
                  model={turn.withAppraise.model}
                  tone="blue"
                  footer={`${turn.withAppraise.usedMemories} memories used`}
                />
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
              No turns yet. Send the first message, then keep going with the same session to build a real side-by-side thread.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Appraise memories used</h2>
              <p className="mt-1 text-xs text-slate-600">These are the memories retrieved before the contextual chatbot replied.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{memories.length} memories</span>
          </div>
          <div className="mt-5 space-y-3">
            {memories.length ? memories.map((memory) => (
              <div key={memory.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-slate-400">{memory.id}</span>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-blue-700">
                    {Math.round(memory.relevanceScore * 100)}% relevant
                  </span>
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-600">{memory.content}</p>
              </div>
            )) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
                No memories yet. Use one of the seeded sessions or send a few messages with the same session.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-950">Raw comparison JSON</h2>
              <p className="mt-1 text-xs text-slate-600">Copy the exact backend response for debugging or demos.</p>
            </div>
            <button onClick={copyJson} disabled={!result} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-blue-700 disabled:opacity-40">
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <Clipboard className="h-4 w-4" />}
            </button>
          </div>
          <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
            {JSON.stringify(result || { status: "Run the comparison to see raw JSON." }, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function ContextCard({ title, icon: Icon, items }: { title: string; icon: typeof Zap; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="flex items-center gap-2 text-xs font-bold text-slate-950">
        <Icon className="h-3.5 w-3.5 text-blue-600" />
        {title}
      </h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-5 text-slate-600">
            {item.replaceAll("_", " ")}
          </div>
        )) : (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-400">None yet</p>
        )}
      </div>
    </div>
  );
}

function BotPanel({
  eyebrow,
  title,
  response,
  reasoning,
  provider,
  model,
  tone,
  footer,
}: {
  eyebrow: string;
  title: string;
  response: string;
  reasoning: string;
  provider?: string;
  model?: string;
  tone: "slate" | "blue";
  footer?: string;
}) {
  const isBlue = tone === "blue";

  return (
    <div className={`rounded-3xl border p-6 shadow-sm ${isBlue ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${isBlue ? "text-blue-700" : "text-slate-500"}`}>{eyebrow}</div>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">{title}</h2>
        </div>
        {(provider || model) && (
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-500">
            {provider} · {model}
          </div>
        )}
      </div>
      <p className="mt-5 rounded-2xl border border-white/70 bg-white p-5 text-sm leading-7 text-slate-700">
        {response}
      </p>
      <p className="mt-4 text-xs leading-6 text-slate-600">{reasoning}</p>
      {footer && <p className="mt-3 text-[11px] font-semibold text-blue-700">{footer}</p>}
    </div>
  );
}

function HistoryResponseCard({
  title,
  response,
  provider,
  model,
  tone,
  footer,
}: {
  title: string;
  response: string;
  provider: string;
  model: string;
  tone: "slate" | "blue";
  footer?: string;
}) {
  const isBlue = tone === "blue";

  return (
    <div className={`rounded-2xl border p-4 ${isBlue ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-950">{title}</div>
        <div className="rounded-full border border-white/80 bg-white px-2 py-1 text-[10px] text-slate-500">
          {provider} · {model}
        </div>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-700">{response}</p>
      {footer && <p className="mt-3 text-[11px] font-semibold text-blue-700">{footer}</p>}
    </div>
  );
}
