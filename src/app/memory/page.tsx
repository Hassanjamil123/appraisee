import Link from "next/link";
import {
  ArrowRight,
  Binary,
  Brain,
  CheckCircle2,
  Database,
  FolderTree,
  Shield,
  Tags,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const memoryTypes = [
  {
    icon: Brain,
    title: "Memories",
    copy: "Facts, actions, preferences, risks, and conversation outcomes that should be available later.",
  },
  {
    icon: Tags,
    title: "Entities",
    copy: "People, companies, orders, candidates, projects, and workflows that your agent should understand structurally.",
  },
  {
    icon: FolderTree,
    title: "Decisions",
    copy: "Approvals, escalations, refusals, and next steps that give the model continuity over time.",
  },
  {
    icon: Shield,
    title: "Project scope",
    copy: "Every memory stream stays isolated inside the right workspace and project boundary.",
  },
];

const examples = [
  "Customer prefers SMS updates for shipping issues.",
  "Candidate has strong backend skills but mixed communication feedback.",
  "Security review is the current blocker for the enterprise deal.",
  "Patient reported continuing tightness and requested follow-up.",
];

const comparison = [
  ["Transcript dumping", "All prior chat is stuffed into the prompt.", "Relevant memory is structured and retrieved intentionally."],
  ["Vector search only", "Context depends on similarity matches alone.", "Memory is tied to workflow stage, entities, and decisions."],
  ["Custom memory code", "Every team rebuilds storage and retrieval logic.", "Appraise gives one project-scoped memory layer."],
];

export default function MemoryPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Database className="h-4 w-4" />
              Memory
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Store what the model should still know tomorrow.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise stores structured memory for AI systems that need continuity. Not just messages, but facts, entities, decisions, risks, and the operational shape of the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#track-api" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Track memory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/retrieval" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                See retrieval
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {memoryTypes.map((item) => (
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
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">What memory looks like in practice</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Developers should be able to track operational context from support systems, CRMs, workflow engines, and internal tools without flattening everything into raw text.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                {examples.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Binary className="h-4 w-4 text-blue-600" />
            Why this is different
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 text-sm">
            <div className="grid grid-cols-3 bg-slate-50 p-3 font-semibold text-slate-700">
              <span>Approach</span>
              <span>Without Appraise</span>
              <span>With Appraise</span>
            </div>
            {comparison.map(([label, withoutText, withText]) => (
              <div key={label} className="grid grid-cols-3 border-t border-slate-200 p-3">
                <span className="font-mono text-blue-700">{label}</span>
                <span className="text-slate-600">{withoutText}</span>
                <span className="text-slate-600">{withText}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
