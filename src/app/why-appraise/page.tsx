import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  GitBranch,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const comparisons = [
  {
    title: "Transcript stuffing",
    without: "The whole conversation gets packed into the prompt whether it helps or not.",
    with: "Appraise retrieves the specific memory window that matters for the current decision.",
  },
  {
    title: "Vector DB only",
    without: "Similarity search finds related text, but it does not understand workflow stage, urgency, or decision pressure.",
    with: "Appraise combines memory with workflow state, entities, prior decisions, and suggested actions.",
  },
  {
    title: "RAG-only memory",
    without: "Document retrieval is useful, but it does not represent live product state across customers and sessions.",
    with: "Appraise is designed for ongoing operational memory, not just static knowledge retrieval.",
  },
  {
    title: "Custom memory logic",
    without: "Every team rebuilds tracking, retrieval, prompt assembly, and comparison flows from scratch.",
    with: "Appraise gives one project-scoped context layer in front of the model.",
  },
];

const pillars = [
  {
    icon: Database,
    title: "Structured memory",
    copy: "Facts, decisions, entities, and events stay queryable instead of dissolving into plain text history.",
  },
  {
    icon: GitBranch,
    title: "Workflow awareness",
    copy: "The same memory means different things at different stages. Appraise understands that.",
  },
  {
    icon: Search,
    title: "Intent-driven retrieval",
    copy: "Context is selected based on the current question, not just semantic resemblance.",
  },
  {
    icon: Brain,
    title: "Better model input",
    copy: "Appraise improves the LLM input so the final reasoning step has better material to work with.",
  },
];

const outcomes = [
  "Fewer blank-slate replies",
  "Less prompt bloat",
  "More continuity across sessions",
  "Stronger support, sales, healthcare, and recruiting agents",
  "Cleaner developer integration path",
];

export default function WhyAppraisePage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-4 w-4" />
              Why Appraise
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Context infrastructure for AI systems that do real work.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise is not just chat history, not just a vector index, and not just another RAG wrapper. It is a workflow-aware memory layer that helps developers give models the right context before they reason.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#llm-reasoning" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Read the developer flow
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?redirectTo=/dashboard/chatbots" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Open chatbot lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <pillar.icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                <Layers3 className="h-4 w-4 text-blue-600" />
                Comparison
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Why not just use a vector DB or RAG stack?</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Because most AI products do not only need document recall. They need live operational context: who the user is, what stage the workflow is in, what happened before, what the risks are, and what action is likely next.
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f7f8fb] shadow-sm">
              <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-slate-200 bg-white px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <div>Approach</div>
                <div>Typical setup</div>
                <div>Appraise</div>
              </div>
              {comparisons.map((row) => (
                <div key={row.title} className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-slate-200 last:border-b-0">
                  <div className="px-5 py-5 text-sm font-semibold text-slate-950">{row.title}</div>
                  <div className="px-5 py-5 text-sm leading-7 text-slate-600">{row.without}</div>
                  <div className="bg-blue-50 px-5 py-5 text-sm leading-7 text-slate-700">{row.with}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">What developers actually get</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {outcomes.map((outcome) => (
              <div key={outcome} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                  <span>{outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
