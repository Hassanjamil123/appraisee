import Link from "next/link";
import { ArrowRight, Bug, ClipboardList, SearchCheck, Shield, Wand2 } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const debuggerPanels = [
  {
    icon: ClipboardList,
    title: "Context logs",
    copy: "Inspect each retrieval request, workflow, latency, and result count instead of treating context like hidden magic.",
  },
  {
    icon: SearchCheck,
    title: "Ranked memories",
    copy: "See which memories won, which ones lost, and how relevance broke down.",
  },
  {
    icon: Wand2,
    title: "LLM rerank summary",
    copy: "Understand when the LLM-assisted reranker stepped in and what it believed mattered most.",
  },
  {
    icon: Shield,
    title: "Session isolation",
    copy: "Verify when Appraise stayed session-local and when it blended in older project memory.",
  },
];

export default function DebuggingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Bug className="h-4 w-4" />
              Debugging
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Make retrieval legible, not mystical.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Developers trust Appraise faster when they can inspect the context window, ranking logic, rerank summary, and session strategy. Debugging is part of the product, not an afterthought.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?redirectTo=/dashboard/memory-explorer" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Open context playground
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?redirectTo=/dashboard/logs" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Open context logs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {debuggerPanels.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
