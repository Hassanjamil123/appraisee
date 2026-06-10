import Link from "next/link";
import { Activity, ArrowRight, BarChart3, Clock3, LineChart, Workflow } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const analyticsCards = [
  {
    icon: Activity,
    title: "Memory volume",
    copy: "See how many memories your product is actually generating and whether the signal is getting cleaner over time.",
  },
  {
    icon: Clock3,
    title: "Latency",
    copy: "Watch retrieval speed so the memory layer feels production-ready, not bolted on.",
  },
  {
    icon: Workflow,
    title: "Workflow activity",
    copy: "Understand which workflows are driving most of the context traffic and event volume.",
  },
  {
    icon: BarChart3,
    title: "Usage patterns",
    copy: "See which products, agents, and teams are actually depending on Appraise in daily use.",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <LineChart className="h-4 w-4" />
              Analytics
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">See whether your memory layer is actually helping.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise analytics show event volume, workflow activity, retrieval latency, and memory growth so teams can treat context quality like a real product surface instead of guessing.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?redirectTo=/dashboard/analytics" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Open analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/debugging" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                See debugging
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {analyticsCards.map((item) => (
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
