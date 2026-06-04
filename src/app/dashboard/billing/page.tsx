"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";
import { formatNumber, formatStorage } from "@/lib/utils";

interface ProjectUsage {
  storageMbUsed: number;
  storageLimitMb: number;
  storagePercent: number;
  monthlyEventWrites: number;
  monthlyContextRequests: number;
  monthlyRequestsTotal: number;
  monthlyRequestLimit: number;
  monthlyRequestsPercent: number;
  retentionDays: number;
}

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [projectName, setProjectName] = useState("your Appraise workspace");
  const [usage, setUsage] = useState<ProjectUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPlan() {
      try {
        const response = await fetch("/api/appraise/v1/projects/current", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok || !mounted) return;

        if (typeof body.plan?.tier === "string") {
          setCurrentPlan(body.plan.tier);
        }
        if (typeof body.project?.name === "string" && body.project.name.trim()) {
          setProjectName(body.project.name);
        }
        if (body.usage) {
          setUsage(body.usage as ProjectUsage);
        }
      } catch {
        // Keep graceful defaults if the backend is unavailable.
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadPlan();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <CreditCard className="h-3.5 w-3.5" />
              Billing and plans
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              Upgrade your Appraise workspace when you are ready.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              {projectName} is currently on the {currentPlan} plan. Move to Pro when your product needs more context volume and API throughput, then use Scale for dedicated support and bigger production workloads.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5 lg:w-80">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Current plan
            </div>
            <p className="mt-4 text-2xl font-semibold text-slate-950 capitalize">
              {loading ? "Loading..." : currentPlan}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Great for onboarding, internal testing, and first production experiments.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Compare plans
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {pricingTiers.map((tier) => {
          const isCurrent = tier.name.toLowerCase() === currentPlan;
          const isPro = tier.name === "Pro";

          return (
            <article
              key={tier.name}
              className={`relative rounded-[2rem] border p-7 shadow-sm ${
                isPro ? "border-blue-200 bg-blue-50 shadow-blue-100" : "border-slate-200 bg-white"
              }`}
            >
              {isCurrent && (
                <span className="absolute right-6 top-6 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Current
                </span>
              )}
              {!isCurrent && isPro && (
                <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Upgrade
                </span>
              )}

              <h2 className="text-xl font-semibold text-slate-950">{tier.name}</h2>
              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{tier.description}</p>
              <div className="mt-7 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight text-slate-950">{tier.price}</span>
                {tier.period && <span className="text-sm text-slate-500">{tier.period}</span>}
              </div>
              <div className="my-7 h-px bg-slate-200" />
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {loading ? (
                  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading plan
                  </div>
                ) : isCurrent ? (
                  <div className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
                    Current plan
                  </div>
                ) : (
                  <Link
                    href="/pricing"
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                      isPro
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {tier.name === "Pro" ? "Upgrade to Pro" : tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Usage this month</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Track how much context traffic and storage this workspace is using before you need the next plan.
              </p>
            </div>
            {loading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <UsageMeter
              label="Monthly requests"
              value={usage ? `${formatNumber(usage.monthlyRequestsTotal)} / ${formatNumber(usage.monthlyRequestLimit)}` : "Waiting for usage data"}
              detail={usage ? `${formatNumber(usage.monthlyEventWrites)} event writes and ${formatNumber(usage.monthlyContextRequests)} context requests` : "Requests are counted when you track events and retrieve context."}
              percent={usage?.monthlyRequestsPercent ?? 0}
            />
            <UsageMeter
              label="Storage used"
              value={usage ? `${formatStorage(usage.storageMbUsed)} / ${formatStorage(usage.storageLimitMb)}` : "Waiting for usage data"}
              detail={usage ? `${usage.retentionDays} day retention on the ${currentPlan} plan` : "Storage grows with tracked events, memories, and retrieval logs."}
              percent={usage?.storagePercent ?? 0}
            />
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-[#f7f8fb] p-7 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Plan shape</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div>
              <div className="font-semibold text-slate-950">Starter</div>
              <div>250 MB storage, 25,000 requests, 2 API keys</div>
            </div>
            <div>
              <div className="font-semibold text-slate-950">Pro</div>
              <div>10 GB storage, 1,000,000 requests, 25 API keys</div>
            </div>
            <div>
              <div className="font-semibold text-slate-950">Scale</div>
              <div>100 GB+ storage, 10,000,000 requests, custom support</div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">How upgrading should work from here</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. Choose a plan",
              copy: "Pick the plan that matches your request volume, context storage, and support needs.",
            },
            {
              title: "2. Attach billing",
              copy: "The next step after this page is wiring Stripe so plan upgrades happen directly inside the dashboard.",
            },
            {
              title: "3. Unlock limits",
              copy: "After payment is connected, Appraise can raise limits and expose the right features automatically.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
              <div className="text-sm font-semibold text-slate-950">{item.title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function UsageMeter({ label, value, detail, percent }: { label: string; value: string; detail: string; percent: number }) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  return (
    <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
      <div className="text-sm font-semibold text-slate-950">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${clampedPercent}%` }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
}
