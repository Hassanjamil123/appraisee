"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Bot, CheckCircle2, MessageSquare, Package, Play, Sparkles, Zap } from "lucide-react";

const sessionId = "northstar_customer_alex_001";
const workflow = "customer_support";
const intent = "resolve_customer_issue";
const customerMessage = "Where is my order? This is getting annoying.";

interface Memory {
  id: string;
  content: string;
  relevanceScore: number;
  relevanceBreakdown: Record<string, number>;
}

interface ContextResult {
  urgencySignals: string[];
  suggestedActions: string[];
  recentMemories: Memory[];
}

const supportEvents = [
  {
    event: "order_placed",
    externalId: "northstar-ord-8842-placed",
    content: "Customer Alex Morgan placed order ORD-8842 for a winter jacket and boots. Order value was $249.",
    metadata: { customerId: "customer_alex_001", orderId: "ORD-8842", value: 249, items: ["winter jacket", "boots"] },
  },
  {
    event: "order_delayed",
    externalId: "northstar-ord-8842-delay-1",
    content: "Order ORD-8842 was delayed because the warehouse missed carrier pickup. Customer was notified by email.",
    metadata: { customerId: "customer_alex_001", orderId: "ORD-8842", delayCount: 1, channel: "email" },
  },
  {
    event: "support_ticket_created",
    externalId: "northstar-ticket-1009",
    content: "Support ticket TICK-1009 opened for Alex Morgan about delivery delay on order ORD-8842.",
    metadata: { customerId: "customer_alex_001", orderId: "ORD-8842", ticketId: "TICK-1009", topic: "delivery_delay" },
  },
  {
    event: "refund_offered",
    externalId: "northstar-refund-ord-8842",
    content: "Support offered Alex Morgan a refund or store credit for order ORD-8842. Customer did not accept yet.",
    metadata: { customerId: "customer_alex_001", orderId: "ORD-8842", refundType: "store_credit", accepted: false },
  },
  {
    event: "order_delayed_again",
    externalId: "northstar-ord-8842-delay-2",
    content: "Order ORD-8842 was delayed for the second time. Latest ETA is Friday. Customer sentiment is frustrated and priority is high.",
    metadata: { customerId: "customer_alex_001", orderId: "ORD-8842", delayCount: 2, latestEta: "Friday", priority: "high", sentiment: "frustrated" },
  },
  {
    event: "customer_preference_saved",
    externalId: "northstar-alex-sms-preference",
    content: "Alex Morgan prefers SMS updates for delivery issues.",
    metadata: { customerId: "customer_alex_001", preference: "sms_delivery_updates" },
  },
];

export default function SupportDemoPage() {
  const [context, setContext] = useState<ContextResult | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function seedDemo() {
    setLoading(true);
    setError("");
    setStatus("Sending ecommerce support events...");

    try {
      const results = [];
      for (const event of supportEvents) {
        const response = await fetch("/api/appraise/v1/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, workflow, createMemory: true, ...event }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error?.message || "Unable to seed support event");
        results.push(body);
      }

      setStatus(`${results.length} support events ready. ${results.filter((result) => result.deduplicated).length} were already present.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to seed support demo");
    } finally {
      setLoading(false);
    }
  }

  async function compareResponses() {
    setLoading(true);
    setError("");
    setStatus("Building Appraise context...");

    try {
      const response = await fetch("/api/appraise/v1/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, workflow, intent, maxMemories: 6, maxEntities: 5 }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to build support context");
      setContext(body);
      setStatus("Comparison ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to compare responses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Support Demo</h1>
          <p className="mt-1 text-xs text-text-secondary">Compare a generic ecommerce chatbot with one powered by Appraise memory.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={seedDemo} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-2 px-3 py-2 text-xs font-bold hover:bg-surface-3">
            <Package className="h-3.5 w-3.5" /> Seed ecommerce events
          </button>
          <button onClick={compareResponses} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple px-3 py-2 text-xs font-bold text-white">
            <Play className="h-3.5 w-3.5" /> Compare responses
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-4 w-4 text-accent-blue" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Customer message</p>
            <p className="mt-2 text-sm text-slate-950">{customerMessage}</p>
            <p className="mt-2 font-mono text-[10px] text-text-tertiary">session: {sessionId} · workflow: {workflow}</p>
          </div>
        </div>
      </div>

      {status && <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" />{status}</div>}
      {error && <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}

      <div className="grid gap-6 xl:grid-cols-2">
        <ChatbotPanel
          title="Without Appraise"
          subtitle="Only sees the current message"
          response="I’m sorry about that. Could you please provide your order number so I can look into the shipment status for you?"
          muted
        />
        <ChatbotPanel
          title="With Appraise"
          subtitle="Uses stored support events and workflow context"
          response={context ? buildAppraiseResponse(context) : "Seed the ecommerce events, then compare responses to see the memory-aware answer."}
        />
      </div>

      {context && (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-accent-purple" />Appraise retrieved context</h2>
            {context.recentMemories.map((memory) => (
              <div key={memory.id} className="rounded-xl border border-border-subtle bg-surface-1 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-text-tertiary">{memory.id}</span>
                  <strong className="text-xs text-emerald-700">{Math.round(memory.relevanceScore * 100)}% relevant</strong>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-secondary">{memory.content}</p>
              </div>
            ))}
          </section>
          <aside className="space-y-4">
            <ContextCard title="Urgency signals" icon={Zap} items={context.urgencySignals} />
            <ContextCard title="Suggested actions" icon={ArrowRight} items={context.suggestedActions} />
          </aside>
        </div>
      )}
    </div>
  );
}

function ChatbotPanel({ title, subtitle, response, muted = false }: { title: string; subtitle: string; response: string; muted?: boolean }) {
  return (
    <section className={`rounded-xl border p-5 ${muted ? "border-border-subtle bg-surface-1" : "border-blue-500/20 bg-blue-500/5"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${muted ? "bg-surface-2" : "bg-blue-500/15"}`}>
          <Bot className={`h-4 w-4 ${muted ? "text-text-tertiary" : "text-blue-700"}`} />
        </div>
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          <p className="text-[11px] text-text-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-border-subtle bg-white p-4 text-sm leading-relaxed text-text-secondary">{response}</div>
    </section>
  );
}

function ContextCard({ title, icon: Icon, items }: { title: string; icon: typeof Zap; items: string[] }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface-1 p-4">
      <h3 className="flex items-center gap-2 text-xs font-bold"><Icon className="h-3.5 w-3.5 text-accent-blue" />{title}</h3>
      <div className="mt-3 space-y-2">{items.length ? items.map((item) => <div key={item} className="rounded-lg bg-surface-2 px-3 py-2 text-[11px] text-text-secondary">{item.replaceAll("_", " ")}</div>) : <p className="text-[11px] text-text-tertiary">None detected</p>}</div>
    </div>
  );
}

function buildAppraiseResponse(context: ContextResult) {
  const hasDelay = context.recentMemories.some((memory) => memory.content.toLowerCase().includes("delayed"));
  const hasRefund = context.recentMemories.some((memory) => memory.content.toLowerCase().includes("refund"));
  const hasSms = context.recentMemories.some((memory) => memory.content.toLowerCase().includes("sms"));

  return [
    "I’m sorry, Alex. I can see order ORD-8842 has already been delayed twice, and the latest ETA is Friday.",
    hasRefund ? "I also see support already offered a refund or store credit, but you have not accepted it yet." : "",
    hasSms ? "I’ll use SMS updates for delivery follow-ups, since that is your saved preference." : "",
    hasDelay ? "Since this is now an escalated delivery issue, I can check expedited delivery first or help you choose refund/store credit." : "",
  ].filter(Boolean).join(" ");
}
