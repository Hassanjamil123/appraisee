import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CloudLightning,
  Database,
  FolderKanban,
  GitBranch,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const codeSample = `import { Appraise } from "@appraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY
});

await appraise.track({
  sessionId: "support_cust_8842",
  workflow: "customer_support",
  event: "refund_requested",
  metadata: {
    customerId: "cust_8842",
    orderId: "ORD-8842",
    priority: "high"
  }
});

const context = await appraise.context.get({
  sessionId: "support_cust_8842",
  workflow: "customer_support",
  intent: "should_we_refund"
});`;

const signalSources = [
  "Chats",
  "Tickets",
  "Orders",
  "CRM",
  "Workflows",
  "Calls",
  "Notes",
  "Entities",
  "Decisions",
  "Support logs",
];

const platformCards = [
  {
    icon: Database,
    title: "Structured memory",
    copy: "Facts, events, preferences, decisions, and risks stay queryable instead of dissolving into transcripts.",
  },
  {
    icon: Workflow,
    title: "Workflow awareness",
    copy: "Appraise remembers not only who someone is, but what stage the work is in and what comes next.",
  },
  {
    icon: Brain,
    title: "Decision-ready context",
    copy: "Retrieve the right memory, linked entities, urgency, and next action before your model replies.",
  },
];

const steps = [
  {
    number: "01",
    title: "Capture the signal",
    copy: "Track what happened across your product: support events, account changes, preferences, risks, and decisions.",
  },
  {
    number: "02",
    title: "Shape the memory",
    copy: "Appraise turns activity into project-scoped memory connected to sessions, entities, and workflows.",
  },
  {
    number: "03",
    title: "Return what matters",
    copy: "When your agent needs to answer, Appraise returns a smaller, sharper window of context with the important threads already surfaced.",
  },
];

const useCases = [
  {
    title: "Customer support",
    copy: "Remember the customer, the order, the refund history, the preferred channel, and the stage of the issue.",
  },
  {
    title: "Sales assistants",
    copy: "Keep live memory of objections, stakeholders, pilots, security blockers, and buying signals across long cycles.",
  },
  {
    title: "Healthcare intake",
    copy: "Track follow-up symptoms, urgency, prior notes, and escalation logic without forcing every turn to start from zero.",
  },
  {
    title: "Recruiting",
    copy: "Hold onto interview signals, concerns, strengths, and the current hiring step so the decision gets clearer over time.",
  },
];

const comparisonRows = [
  {
    label: "Memory source",
    without: "Loose chat history or none at all",
    with: "Structured events, memories, entities, and workflow state",
  },
  {
    label: "Retrieval",
    without: "Similarity guesswork or full transcript dumps",
    with: "Project-scoped context retrieval tuned to the current intent",
  },
  {
    label: "Workflow awareness",
    without: "No real sense of stage or next step",
    with: "Understands stage, blockers, urgency, and decision history",
  },
  {
    label: "Developer experience",
    without: "Custom memory logic everywhere",
    with: "One API to track, retrieve, compare, and reason",
  },
];

const architectureFlow = [
  "Your product tracks events",
  "Appraise stores project memory",
  "Context is retrieved before reply",
  "LLM answers with the right context",
];

const trustItems = [
  {
    icon: CloudLightning,
    title: "REST API",
    copy: "Track events, retrieve context, inspect projects, and manage keys.",
  },
  {
    icon: Sparkles,
    title: "TypeScript SDK",
    copy: "A clean integration path for products already shipping Node or TypeScript.",
  },
  {
    icon: FolderKanban,
    title: "Python SDK soon",
    copy: "The public docs can already frame the Python path while we finish the client.",
  },
  {
    icon: LockKeyhole,
    title: "Project-scoped auth",
    copy: "Every memory stream belongs to a project, with API keys and usage limits applied there.",
  },
];

const tabs = [
  {
    label: "Support",
    eyebrow: "Customer support",
    prompt: "Where is my order? I already asked yesterday.",
    context: [
      "Order ORD-8842 delayed twice",
      "Refund already discussed",
      "Customer prefers SMS updates",
      "Priority marked high",
    ],
    answer: "I can see this order has already been delayed twice and a refund was discussed. I can either process the refund now or send you an SMS update if the shipment clears today.",
  },
  {
    label: "Sales",
    eyebrow: "Sales assistant",
    prompt: "Should I send pricing now or wait?",
    context: [
      "Security review still open",
      "CFO requested pricing last week",
      "Pilot feedback was positive",
      "Legal review is not started",
    ],
    answer: "Send pricing with a short note that security review is still the gating step. The deal has enough buying signal to keep momentum, but you should frame it around the open review.",
  },
  {
    label: "Healthcare",
    eyebrow: "Healthcare intake",
    prompt: "I still feel tightness. Should this be escalated?",
    context: [
      "Chest tightness mentioned yesterday",
      "Follow-up was requested",
      "Urgency signal present",
      "Triage rule suggests escalation",
    ],
    answer: "Because the tightness is continuing and there was already a follow-up request, this should be escalated for clinical review rather than treated like a fresh intake.",
  },
  {
    label: "Recruiting",
    eyebrow: "Recruiting",
    prompt: "Should we extend an offer?",
    context: [
      "Strong backend skills",
      "Mixed communication feedback",
      "Final hiring stage",
      "Role needs client-facing strength",
    ],
    answer: "Do not extend yet. The current context suggests one more focused interview on communication and client-facing judgment before making the final call.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.16),transparent_58%)]" />
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 lg:pb-24 lg:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              <CloudLightning className="h-3.5 w-3.5 text-blue-600" />
              Memory for real AI workflows
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Memory, when the work gets complicated.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise is the memory and context layer for AI products. It keeps hold of the details that matter,
              the stage the work is in, and the history beneath the current message, so your agents can respond with
              more grace than guesswork.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                View demo
              </Link>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              {signalSources.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2rem] border border-slate-200 bg-[#fcfcfd] p-5 shadow-sm">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-400">appraise.ts</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-slate-200">
                  <code>{codeSample}</code>
                </pre>
              </div>
            </article>

            <div className="grid gap-6">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <Layers3 className="h-4 w-4 text-blue-600" />
                  Context window
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight">A smaller answer can hold more truth.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Instead of throwing the entire past into a prompt, Appraise returns a tighter memory window:
                  what matters now, who it touches, what was decided, and what the workflow suggests next.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["28", "memories ranked"],
                    ["4", "entities linked"],
                    ["3", "next actions suggested"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-2xl font-semibold text-slate-950">{value}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  Project scoped
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  One company can store memory for thousands of customers inside one Appraise project. Sessions, entities,
                  workflows, and retrieval rules keep the right context close without splitting the product into a thousand pieces.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Built for teams shipping real AI support, sales, and workflow agents",
              "Project-scoped memory for multi-customer products",
              "Designed for developer evaluation, not just demos",
            ].map((line) => (
              <div key={line} className="rounded-full border border-slate-200 bg-white px-5 py-4 text-center text-sm font-medium text-slate-600 shadow-sm">
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="border-b border-slate-200 bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Platform</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">A memory layer, not a prompt patch.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Appraise is built for products where context is operational: not just similarity search, but decisions, workflows,
              accounts, candidates, symptoms, escalations, and the shape of what comes next.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {platformCards.map((card) => (
              <article key={card.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <card.icon className="h-6 w-6 text-blue-600" />
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Interactive example</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">What the model sees before it replies.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                This is the moment Appraise matters. Your application asks for context, Appraise returns a sharper window,
                and the model answers from that instead of from a blank stare.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-6 shadow-sm">
              <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Current message</div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    “Where is my order? I already asked yesterday.”
                  </p>
                  <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Retrieved context</div>
                  <div className="mt-3 space-y-2">
                    {[
                      "Order delayed twice",
                      "Refund discussed",
                      "Customer prefers SMS",
                      "Priority marked high",
                    ].map((item) => (
                      <div key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">Appraise-informed reply</div>
                  <p className="mt-3 text-sm leading-7 text-slate-700">
                    “I can see this order has already been delayed twice and refund options were discussed. I can process the refund now, or send you an SMS update if the shipment clears today.”
                  </p>
                  <div className="mt-6 grid gap-2">
                    {[
                      "Urgency: delivery issue",
                      "Action: refund or credit",
                      "Channel: SMS preferred",
                    ].map((item) => (
                      <div key={item} className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-[11px] text-slate-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Track. Retrieve. Reply.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              The loop is simple on purpose. Your product sends real events into Appraise, Appraise returns the context
              that matters, and your model answers with memory instead of improvisation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-6">
                <div className="text-sm font-semibold text-blue-600">{step.number}</div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Architecture</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">A simple loop in front of the model.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Appraise sits between your product events and your model response, shaping history into something useful before the model speaks.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {architectureFlow.map((item, index) => (
              <div key={item} className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">Step {index + 1}</div>
                <p className="mt-5 text-lg font-semibold tracking-tight text-slate-950">{item}</p>
                {index < architectureFlow.length - 1 && (
                  <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Why Appraise</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">More than chat history. More than vectors.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Most memory systems stop at similarity. Appraise pushes toward operational context: what happened, who is involved,
                what stage the workflow is in, and what decision pressure exists now.
              </p>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f8fb] shadow-sm">
              <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-slate-200 bg-white px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <div>Layer</div>
                <div>Typical memory setup</div>
                <div>Appraise</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-slate-200 last:border-b-0">
                  <div className="px-5 py-5 text-sm font-semibold text-slate-950">{row.label}</div>
                  <div className="px-5 py-5 text-sm leading-7 text-slate-600">{row.without}</div>
                  <div className="bg-blue-50 px-5 py-5 text-sm leading-7 text-slate-700">{row.with}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="border-b border-slate-200 bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Use-case tabs</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">The same memory engine, across different kinds of work.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Appraise is not just for support. The core loop stays the same while the surrounding workflow changes.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {tabs.map((tab) => (
              <article key={tab.label} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">{tab.eyebrow}</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{tab.label}</h3>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Prompt</div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{tab.prompt}</p>
                </div>
                <div className="mt-4 space-y-2">
                  {tab.context.map((item) => (
                    <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">Reply</div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{tab.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Developer trust</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Built to be used by developers, not narrated to them.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              A real API, a real SDK path, project-scoped identity, usage limits, and secure key handling all matter if Appraise is going to become infrastructure instead of a pretty idea.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-6">
                <item.icon className="h-5 w-5 text-blue-600" />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Use cases</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Built for work that leaves a trail.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Support, sales, healthcare, recruiting, internal copilots, and any other system where a good answer depends on what came before.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600">
              <Shield className="h-4 w-4 text-blue-600" />
              Project-scoped, API-first, workflow-aware
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-6">
                <GitBranch className="h-5 w-5 text-blue-600" />
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{useCase.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{useCase.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2.5rem] border border-slate-200 bg-slate-950 px-8 py-12 text-white shadow-2xl shadow-slate-200/60">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                <Bot className="h-3.5 w-3.5" />
                Build with the API
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight">
                Give your chatbot a longer memory and a steadier voice.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Start in the console, test the side-by-side chatbot lab, then wire Appraise into your own product when you are ready.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Read docs
                </Link>
                <Link
                  href="/login?redirectTo=/dashboard/chatbots"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open chatbot lab
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
