"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Can I upgrade or downgrade my plan later?",
      a: "Yes. You can upgrade, downgrade, or cancel your plan from Billing Settings inside the console.",
    },
    {
      q: "What happens when I exceed my monthly API request limits?",
      a: "Starter accounts receive rate-limit responses. Pro and Scale accounts can use alerts and usage-based overages.",
    },
    {
      q: "Is context stored securely on Appraise?",
      a: "Context is designed to be stored server-side with encrypted transport, backend API keys, and production access controls.",
    },
    {
      q: "Do you offer developer support?",
      a: "Starter gets community support, Pro gets priority email, and Scale gets a dedicated implementation channel.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-16">
        <section className="text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            Pricing for memory infrastructure
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight">
            Start small. Scale as your AI product remembers more.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Start with a live demo and a real integration path. Upgrade when your AI product needs more context volume, retrieval traffic, and support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/demo" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
              View live demo
            </Link>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  billingPeriod === "monthly" ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  billingPeriod === "annual" ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Annual, save 20%
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => {
            const isPro = tier.highlighted;
            const displayPrice = billingPeriod === "annual" && tier.name === "Pro" ? "$39" : tier.price;
            const displayPeriod = billingPeriod === "annual" && tier.name === "Pro" ? "/month billed annually" : tier.period;

            return (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-[2rem] border p-7 shadow-sm ${
                  isPro ? "border-blue-200 bg-blue-50 shadow-blue-100" : "border-slate-200 bg-white"
                }`}
              >
                {isPro && (
                  <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </span>
                )}
                <h2 className="text-xl font-semibold">{tier.name}</h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{tier.description}</p>
                <div className="mt-7 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tracking-tight">{displayPrice}</span>
                  {displayPeriod && <span className="text-sm text-slate-500">{displayPeriod}</span>}
                </div>
                <div className="my-7 h-px bg-slate-200" />
                <ul className="flex-1 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isPro ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-slate-300 bg-white text-slate-800 hover:border-slate-400"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Feature comparison</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 text-sm">
            <div className="grid grid-cols-4 bg-slate-50 p-4 font-semibold text-slate-700">
              <span>Metric</span>
              <span>Starter</span>
              <span>Pro</span>
              <span>Scale</span>
            </div>
            {[
              ["Monthly requests", "10,000", "500,000", "Unlimited"],
              ["Context limit", "100MB", "10GB", "Unlimited"],
              ["SDK support", "Yes", "Yes", "Yes"],
              ["SSO support", "No", "No", "Yes"],
            ].map((row) => (
              <div key={row[0]} className="grid grid-cols-4 border-t border-slate-200 p-4 text-slate-600">
                <span className="font-semibold text-slate-950">{row[0]}</span>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-sm font-semibold text-slate-950 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isOpen && <div className="border-t border-slate-200 px-6 py-5 text-sm leading-7 text-slate-600">{faq.a}</div>}
              </div>
            );
          })}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
