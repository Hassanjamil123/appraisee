import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Search,
  Sparkles,
  Target,
  TimerReset,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const outputs = [
  {
    icon: Brain,
    title: "Relevant memories",
    copy: "The facts and events that actually matter for the current question.",
  },
  {
    icon: TimerReset,
    title: "Urgency signals",
    copy: "Signs that the interaction needs escalation, faster response, or a specific safety path.",
  },
  {
    icon: Target,
    title: "Suggested actions",
    copy: "Operational next steps that should shape the model output or workflow decision.",
  },
  {
    icon: Compass,
    title: "Workflow context",
    copy: "The current stage, likely goal, and surrounding state the agent needs to reason well.",
  },
];

const flow = [
  "Start with the latest message or operational question.",
  "Use intent and workflow scope to narrow the retrieval problem.",
  "Pull the memories, entities, and prior decisions that actually matter now.",
  "Package the context so the LLM gets a smaller, sharper input window.",
];

export default function RetrievalPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Search className="h-4 w-4" />
              Retrieval
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Return the smallest useful window of context.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Retrieval is where Appraise becomes more than storage. It decides what context matters now, packages it for reasoning, and keeps your prompts tighter than raw history dumps.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#context-api" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Read the Context API
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/llms" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                See how LLMs use it
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {outputs.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Retrieval loop
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {flow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">0{index + 1}</div>
                  <div className="mt-2">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
