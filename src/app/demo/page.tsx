import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, MessageSquare, Sparkles, Target, Zap } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const responsePreview = {
  chatbot: {
    response:
      "I checked the customer history and current support context. The most relevant context is that order ORD-8842 was delayed twice, support already offered a refund or store credit, and the customer prefers SMS updates. Important signals: delivery issue, time sensitive, support escalation. I would answer with the known order status and offer the next support option instead of asking the customer to repeat details.",
    usedMemories: 7,
    urgencySignals: ["delivery_issue", "time_sensitive", "support_escalation", "refund_or_credit_pending"],
    suggestedActions: ["check_delivery_status", "offer_refund_or_store_credit", "send_sms_update"],
  },
};

const memories = [
  "Order ORD-8842 was delayed because the warehouse missed carrier pickup.",
  "Order ORD-8842 was delayed for the second time. Latest ETA is Friday. Customer sentiment is frustrated and priority is high.",
  "Support offered Alex Morgan a refund or store credit for order ORD-8842. Customer did not accept yet.",
  "Alex Morgan prefers SMS updates for delivery issues.",
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Public demo
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">Watch Appraise turn a vague chatbot reply into a contextual one.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              This is the same product flow developers wire into real apps: track what happened, retrieve workflow-aware context, then let the chatbot reply with memory instead of starting from zero.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800">
                Read docs
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">POST /v1/chatbots/respond</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">200 OK</span>
              </div>
              <pre className="overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-200">
                {JSON.stringify(responsePreview, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-950">Incoming user message</h2>
                <p className="text-xs text-slate-500">What the chatbot sees right now</p>
              </div>
            </div>
            <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              Where is my order? This is getting annoying.
            </p>

            <div className="mt-8 grid gap-4">
              <ComparisonCard
                title="Without Appraise"
                muted
                response="Sorry about that. Could you provide your order number so I can check the shipment status?"
              />
              <ComparisonCard
                title="With Appraise"
                response="I can already see order ORD-8842 was delayed twice, a refund was offered, and SMS is the saved preference. I would reply with the known order status and offer refund, credit, or an SMS update without asking the customer to repeat details."
              />
            </div>
          </div>

          <div className="space-y-4">
            <InfoPanel title="Retrieved memories" icon={Sparkles} items={memories} />
            <InfoPanel title="Urgency signals" icon={Zap} items={responsePreview.chatbot.urgencySignals.map((item) => item.replaceAll("_", " "))} />
            <InfoPanel title="Suggested actions" icon={Target} items={responsePreview.chatbot.suggestedActions.map((item) => item.replaceAll("_", " "))} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-8 text-center">
          <h2 className="text-4xl font-semibold tracking-tight">Public pages stay public. The console stays protected.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Use the public site to explain the product, SDK, and live demo. Sign in to access chatbots, examples, event logs, API keys, and the rest of the console.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/login?redirectTo=/dashboard" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800">
              Sign in to console
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

function ComparisonCard({ title, response, muted = false }: { title: string; response: string; muted?: boolean }) {
  return (
    <article className={`rounded-2xl border p-5 ${muted ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${muted ? "bg-slate-100" : "bg-blue-100"}`}>
          <Bot className={`h-4 w-4 ${muted ? "text-slate-500" : "text-blue-700"}`} />
        </div>
        <h3 className="text-sm font-bold text-slate-950">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-700">{response}</p>
    </article>
  );
}

function InfoPanel({ title, icon: Icon, items }: { title: string; icon: typeof Sparkles; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
        <Icon className="h-4 w-4 text-blue-600" />
        {title}
      </h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
