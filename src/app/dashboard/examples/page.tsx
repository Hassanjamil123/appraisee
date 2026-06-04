"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Clipboard,
  ClipboardList,
  Code,
  HeartPulse,
  MessageSquare,
  Package,
  Play,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

type ExampleId = "ecommerce" | "sales" | "healthcare" | "recruiting";

interface ExampleEvent {
  event: string;
  externalId: string;
  content: string;
  metadata: Record<string, unknown>;
}

interface ExampleConfig {
  id: ExampleId;
  name: string;
  shortName: string;
  workflow: string;
  sessionId: string;
  persona: string;
  currentMessage: string;
  intent: string;
  icon: typeof Package;
  accent: string;
  withoutAppraise: string;
  withAppraiseLead: string;
  events: ExampleEvent[];
}

interface Memory {
  id: string;
  content: string;
  relevanceScore: number;
  relevanceBreakdown?: Record<string, number>;
}

interface ContextResult {
  urgencySignals?: string[];
  suggestedActions?: string[];
  inferredGoals?: string[];
  recentMemories?: Memory[];
  workflowContext?: {
    currentStage?: string;
    nextExpectedAction?: string;
  };
}

const examples: ExampleConfig[] = [
  {
    id: "ecommerce",
    name: "Ecommerce Customer Support",
    shortName: "Ecommerce",
    workflow: "customer_support",
    sessionId: "example_ecommerce_alex_001",
    persona: "Alex Morgan, premium customer",
    currentMessage: "Where is my order? This is getting annoying.",
    intent: "resolve_customer_issue",
    icon: Package,
    accent: "bg-blue-50 text-blue-700 border-blue-200",
    withoutAppraise: "Sorry about that. Could you provide your order number so I can check the shipment status?",
    withAppraiseLead: "I can see the order and prior support history already.",
    events: [
      {
        event: "order_placed",
        externalId: "example-ecom-order-8842",
        content: "Alex Morgan placed order ORD-8842 for a winter jacket and boots. Order value was $249.",
        metadata: { orderId: "ORD-8842", customerTier: "premium", value: 249 },
      },
      {
        event: "order_delayed",
        externalId: "example-ecom-delay-1",
        content: "Order ORD-8842 was delayed because the warehouse missed carrier pickup. Customer was notified by email.",
        metadata: { orderId: "ORD-8842", delayCount: 1, channel: "email" },
      },
      {
        event: "refund_offered",
        externalId: "example-ecom-refund-1",
        content: "Support offered Alex Morgan a refund or store credit for order ORD-8842. Customer has not accepted yet.",
        metadata: { orderId: "ORD-8842", refundOffered: true, accepted: false },
      },
      {
        event: "customer_preference_saved",
        externalId: "example-ecom-sms-pref",
        content: "Alex Morgan prefers SMS updates for delivery problems.",
        metadata: { preference: "sms_delivery_updates" },
      },
    ],
  },
  {
    id: "sales",
    name: "SaaS Sales Assistant",
    shortName: "Sales",
    workflow: "sales_pipeline",
    sessionId: "example_sales_nova_001",
    persona: "NovaOps buying committee",
    currentMessage: "Should I send pricing now or wait for the security review?",
    intent: "recommend_next_sales_action",
    icon: Briefcase,
    accent: "bg-indigo-50 text-indigo-700 border-indigo-200",
    withoutAppraise: "You could send pricing now, but it may be worth asking whether they need more information first.",
    withAppraiseLead: "The account is in procurement but security is still the blocker.",
    events: [
      {
        event: "discovery_call_completed",
        externalId: "example-sales-discovery",
        content: "NovaOps completed discovery. They need a memory layer for support agents and want SOC 2 documentation before procurement.",
        metadata: { company: "NovaOps", stage: "discovery", requirement: "SOC2" },
      },
      {
        event: "stakeholder_added",
        externalId: "example-sales-cfo",
        content: "CFO Priya Rao joined the buying process and requested annual pricing with startup discount options.",
        metadata: { stakeholder: "Priya Rao", role: "CFO", pricing: "annual" },
      },
      {
        event: "security_review_pending",
        externalId: "example-sales-security",
        content: "Security review is pending. Buyer asked for data retention, encryption, and API key handling details.",
        metadata: { blocker: "security_review", topics: ["retention", "encryption", "api_keys"] },
      },
      {
        event: "pilot_success",
        externalId: "example-sales-pilot",
        content: "Pilot showed 37 percent faster support resolution when agents received Appraise context before replying.",
        metadata: { outcome: "pilot_success", improvement: 37 },
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare Intake Copilot",
    shortName: "Healthcare",
    workflow: "clinical_triage",
    sessionId: "example_healthcare_maya_001",
    persona: "Maya Patel, follow-up patient",
    currentMessage: "I still feel tightness and I am not sure if I should wait until tomorrow.",
    intent: "triage_next_action",
    icon: HeartPulse,
    accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    withoutAppraise: "If symptoms continue, please contact your healthcare provider or seek urgent care if they worsen.",
    withAppraiseLead: "The copilot remembers the symptom history and prior escalation rule.",
    events: [
      {
        event: "intake_completed",
        externalId: "example-health-intake",
        content: "Maya Patel completed intake yesterday and reported chest tightness after exercise with mild shortness of breath.",
        metadata: { symptom: "chest_tightness", severity: "moderate", timing: "yesterday" },
      },
      {
        event: "nurse_callback",
        externalId: "example-health-nurse-call",
        content: "Nurse callback advised Maya to monitor symptoms and escalate if tightness persisted or breathing worsened.",
        metadata: { escalationRule: "persistent_tightness_or_worse_breathing" },
      },
      {
        event: "preference_saved",
        externalId: "example-health-preference",
        content: "Maya prefers morning appointments and SMS reminders.",
        metadata: { appointmentPreference: "morning", reminderChannel: "sms" },
      },
      {
        event: "risk_note_added",
        externalId: "example-health-risk",
        content: "Clinical workflow marked this as time sensitive if symptoms continue beyond 24 hours.",
        metadata: { risk: "time_sensitive", thresholdHours: 24 },
      },
    ],
  },
  {
    id: "recruiting",
    name: "Recruiting Decision Agent",
    shortName: "Recruiting",
    workflow: "recruiting_pipeline",
    sessionId: "example_recruiting_sarah_001",
    persona: "Sarah Chen, senior backend candidate",
    currentMessage: "Should we extend an offer or run one more interview?",
    intent: "should_we_extend_offer",
    icon: ClipboardList,
    accent: "bg-purple-50 text-purple-700 border-purple-200",
    withoutAppraise: "Review the interview notes and decide whether the candidate meets the role requirements.",
    withAppraiseLead: "The hiring context shows strong technical signal with one communication concern.",
    events: [
      {
        event: "technical_interview_completed",
        externalId: "example-rec-tech",
        content: "Sarah Chen scored highly on backend system design and debugging. Interviewer noted strong distributed systems knowledge.",
        metadata: { candidate: "Sarah Chen", signal: "strong_backend", score: 0.88 },
      },
      {
        event: "culture_interview_completed",
        externalId: "example-rec-culture",
        content: "Culture interview was positive, but interviewer flagged communication could be clearer for client-facing projects.",
        metadata: { concern: "communication", severity: "medium" },
      },
      {
        event: "compensation_expectation_saved",
        externalId: "example-rec-comp",
        content: "Sarah expects $165k base and prefers remote-first teams.",
        metadata: { baseSalary: 165000, preference: "remote_first" },
      },
      {
        event: "workflow_stage_updated",
        externalId: "example-rec-stage",
        content: "Recruiting workflow moved Sarah Chen to final hiring decision stage.",
        metadata: { stage: "final_decision", nextAction: "offer_or_additional_interview" },
      },
    ],
  },
];

export default function ExamplesPage() {
  const [selectedId, setSelectedId] = useState<ExampleId>("ecommerce");
  const [context, setContext] = useState<ContextResult | null>(null);
  const [question, setQuestion] = useState(examples[0].currentMessage);
  const [lastRequest, setLastRequest] = useState<Record<string, unknown> | null>(null);
  const [rawResponse, setRawResponse] = useState<unknown>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [seeded, setSeeded] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => examples.find((example) => example.id === selectedId) ?? examples[0],
    [selectedId]
  );

  function selectExample(id: ExampleId) {
    const next = examples.find((example) => example.id === id) ?? examples[0];
    setSelectedId(id);
    setQuestion(next.currentMessage);
    setContext(null);
    setLastRequest(null);
    setRawResponse(null);
    setSeeded(false);
    setStatus("");
    setError("");
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  async function seedExample() {
    setLoading(true);
    setError("");
    setStatus(`Seeding ${selected.shortName.toLowerCase()} memory...`);

    try {
      let deduped = 0;
      for (const event of selected.events) {
        const response = await fetch("/api/appraise/v1/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: selected.sessionId,
            workflow: selected.workflow,
            createMemory: true,
            ...event,
          }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error?.message || "Unable to seed example event");
        if (body.deduplicated) deduped += 1;
      }

      setSeeded(true);
      setStatus(`${selected.events.length} memories ready. ${deduped} were already present.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to seed example");
    } finally {
      setLoading(false);
    }
  }

  async function retrieveContext() {
    setLoading(true);
    setError("");
    setStatus("Retrieving workflow-aware context...");

    try {
      const payload = {
        sessionId: selected.sessionId,
        workflow: selected.workflow,
        intent: question.trim() || selected.intent,
        query: question.trim() || selected.currentMessage,
        maxMemories: 8,
        maxEntities: 5,
      };
      setLastRequest(payload);

      const response = await fetch("/api/appraise/v1/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      setRawResponse(body);
      if (!response.ok) throw new Error(body.error?.message || "Unable to retrieve context");
      setContext(body);
      setStatus("Context retrieved. The AI input is ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve context");
    } finally {
      setLoading(false);
    }
  }

  const memories = context?.recentMemories ?? [];
  const urgencySignals = context?.urgencySignals ?? [];
  const suggestedActions = context?.suggestedActions ?? [];
  const inferredGoals = context?.inferredGoals ?? [];
  const integrationSnippet = buildIntegrationSnippet(selected, question);

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-4 w-4" />
              Live examples
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
              Choose a workflow and watch Appraise build context end to end.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Each example seeds realistic product events, stores memory, retrieves context,
              shows the AI input, and compares a generic response against a memory-aware response.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={seedExample}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400 disabled:opacity-60"
            >
              <Package className="h-4 w-4" />
              Seed memory
            </button>
            <button
              onClick={retrieveContext}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              Retrieve context
            </button>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {examples.map((example) => {
          const Icon = example.icon;
          const active = example.id === selected.id;
          return (
            <button
              key={example.id}
              onClick={() => selectExample(example.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                active
                  ? "border-blue-300 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${example.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-950">{example.name}</h2>
              <p className="mt-2 text-xs leading-6 text-slate-600">{example.persona}</p>
              <p className="mt-3 font-mono text-[10px] text-slate-400">{example.workflow}</p>
            </button>
          );
        })}
      </section>

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

      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <ProcessCard number="1" title="Selected workflow" done>
            <p>{selected.name}</p>
            <p className="mt-1 font-mono text-[10px] text-slate-400">session: {selected.sessionId}</p>
          </ProcessCard>
          <ProcessCard number="2" title="Seed memory" done={seeded}>
            <p>{selected.events.length} events become memories for this session.</p>
          </ProcessCard>
          <ProcessCard number="3" title="Ask live question" done>
            <p>{question}</p>
          </ProcessCard>
          <ProcessCard number="4" title="Retrieve context" done={!!context}>
            <p>Intent: <span className="font-mono">{selected.intent}</span></p>
          </ProcessCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-950">Ask a live question</h2>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              This question becomes the live intent/query in the Appraise context request.
            </p>
            <textarea
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setContext(null);
                setLastRequest(null);
                setRawResponse(null);
              }}
              className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {[selected.currentMessage, "What should the assistant do next?", "What context matters before replying?", "Should this be escalated?"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setQuestion(preset);
                    setContext(null);
                    setLastRequest(null);
                    setRawResponse(null);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-700"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ResponseCard title="Without Appraise" muted response={selected.withoutAppraise} />
            <ResponseCard title="With Appraise" response={buildMemoryAwareResponse(selected, context)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-950">AI input with Appraise context</h2>
          </div>
          <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
            {buildPromptPreview(selected, question, context)}
          </pre>
        </div>

        <aside className="space-y-4">
          <ContextPanel title="Urgency signals" icon={Zap} items={urgencySignals} />
          <ContextPanel title="Suggested actions" icon={Target} items={suggestedActions} />
          <ContextPanel title="Inferred goals" icon={Sparkles} items={inferredGoals.slice(0, 5)} />
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <JsonPanel
          title="Live request JSON"
          subtitle="Payload sent to POST /v1/context"
          value={lastRequest ?? {
            sessionId: selected.sessionId,
            workflow: selected.workflow,
            intent: question || selected.intent,
            query: question || selected.currentMessage,
            maxMemories: 8,
            maxEntities: 5,
          }}
          copied={copied === "request"}
          onCopy={() => copy(JSON.stringify(lastRequest ?? {
            sessionId: selected.sessionId,
            workflow: selected.workflow,
            intent: question || selected.intent,
            query: question || selected.currentMessage,
            maxMemories: 8,
            maxEntities: 5,
          }, null, 2), "request")}
        />
        <JsonPanel
          title="Live response JSON"
          subtitle="Raw Appraise response returned to the developer"
          value={rawResponse ?? { status: "Run Retrieve context to see the live response." }}
          copied={copied === "response"}
          onCopy={() => copy(JSON.stringify(rawResponse ?? { status: "Run Retrieve context to see the live response." }, null, 2), "response")}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-950">Copy integration code</h2>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              This snippet shows how a {selected.shortName.toLowerCase()} app would retrieve Appraise context before calling its LLM.
            </p>
          </div>
          <button
            onClick={() => copy(integrationSnippet, "integration")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-blue-200 hover:text-blue-700"
          >
            {copied === "integration" ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <Clipboard className="h-4 w-4" />}
            Copy code
          </button>
        </div>
        <pre className="mt-5 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
          {integrationSnippet}
        </pre>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-950">Stored memory</h2>
            <p className="mt-1 text-xs text-slate-600">Seeded events and retrieved memories for the selected workflow.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {memories.length || selected.events.length} items
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {(memories.length
            ? memories.map((memory) => ({
                key: memory.id,
                label: `${Math.round(memory.relevanceScore * 100)}% relevant`,
                content: memory.content,
              }))
            : selected.events.map((event) => ({
                key: event.externalId,
                label: event.event,
                content: event.content,
              }))
          ).map((item) => (
            <div key={item.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] text-slate-400">{item.key}</span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-blue-700">{item.label}</span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">{item.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProcessCard({ number, title, done, children }: { number: string; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
          {done ? <CheckCircle2 className="h-4 w-4" /> : number}
        </span>
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 text-xs leading-6 text-slate-600">{children}</div>
    </div>
  );
}

function ResponseCard({ title, response, muted = false }: { title: string; response: string; muted?: boolean }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${muted ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${muted ? "bg-slate-100" : "bg-blue-100"}`}>
          <Bot className={`h-4 w-4 ${muted ? "text-slate-500" : "text-blue-700"}`} />
        </div>
        <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      </div>
      <p className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700">
        {response}
      </p>
    </div>
  );
}

function ContextPanel({ title, icon: Icon, items }: { title: string; icon: typeof Zap; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
        <Icon className="h-4 w-4 text-blue-600" />
        {title}
      </h3>
      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-6 text-slate-600">
              {formatLabel(item)}
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-400">Run context retrieval to populate this panel.</p>
        )}
      </div>
    </div>
  );
}

function JsonPanel({
  title,
  subtitle,
  value,
  copied,
  onCopy,
}: {
  title: string;
  subtitle: string;
  value: unknown;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-950">{title}</h2>
          <p className="mt-2 text-xs leading-6 text-slate-600">{subtitle}</p>
        </div>
        <button onClick={onCopy} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-blue-700">
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <Clipboard className="h-4 w-4" />}
        </button>
      </div>
      <pre className="mt-5 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-200">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}

function buildPromptPreview(example: ExampleConfig, question: string, context: ContextResult | null) {
  return `You are an AI assistant inside this workflow:
${example.workflow}

Persona:
${example.persona}

Current user message:
${question || example.currentMessage}

Appraise context:
${JSON.stringify(context ?? { status: "Run context retrieval to populate live Appraise context." }, null, 2)}

Instruction:
Use the retrieved memories, workflow state, urgency signals, and suggested actions before replying.`;
}

function buildMemoryAwareResponse(example: ExampleConfig, context: ContextResult | null) {
  if (!context) {
    return "Seed memory, then retrieve context to see the memory-aware answer for this workflow.";
  }

  const memories = context.recentMemories ?? [];
  const actions = context.suggestedActions ?? [];
  const memorySummary = memories.slice(0, 2).map((memory) => memory.content).join(" ");
  const actionSummary = actions.slice(0, 3).map(formatLabel).join(", ");

  return [
    example.withAppraiseLead,
    memorySummary ? `Relevant context: ${memorySummary}` : "",
    actionSummary ? `Recommended next actions: ${actionSummary}.` : "",
  ].filter(Boolean).join(" ");
}

function buildIntegrationSnippet(example: ExampleConfig, question: string) {
  const clientName =
    example.id === "healthcare" ? "intakeCopilot" :
    example.id === "sales" ? "salesAssistant" :
    example.id === "recruiting" ? "recruitingAgent" :
    "supportBot";

  return `import { Appraise } from "@appraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY,
  baseUrl: process.env.APPRAISE_API_URL
});

export async function ${clientName}(message: string) {
  const context = await appraise.context.get({
    sessionId: "${example.sessionId}",
    workflow: "${example.workflow}",
    intent: message,
    query: message,
    maxMemories: 8,
    maxEntities: 5
  });

  const prompt = \`
You are an AI assistant for ${example.name}.

Persona:
${example.persona}

Current user message:
\${message}

Appraise context:
\${JSON.stringify(context, null, 2)}

Use the retrieved memories, workflow state, urgency signals, and suggested actions before replying.
\`;

  return llm.chat(prompt);
}

await ${clientName}(${JSON.stringify(question || example.currentMessage)});`;
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}
