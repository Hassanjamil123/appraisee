"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, KeyRound, Layers3, Rocket, ShieldCheck } from "lucide-react";
import { completeOnboarding } from "@/lib/auth-actions";
import { getUseCaseLabel, onboardingUseCases, type OnboardingUseCase } from "@/lib/onboarding";

interface Props {
  displayName: string;
  initialProjectName?: string;
  initialCompanyName?: string;
  initialUseCase?: OnboardingUseCase;
  initialApiKeyName?: string;
}

export default function OnboardingFlow({
  displayName,
  initialProjectName,
  initialCompanyName,
  initialUseCase,
  initialApiKeyName,
}: Props) {
  const [projectName, setProjectName] = useState(initialProjectName || "");
  const [companyName, setCompanyName] = useState(initialCompanyName || "");
  const [useCase, setUseCase] = useState<OnboardingUseCase>(initialUseCase || "customer_support");
  const [apiKeyName, setApiKeyName] = useState(initialApiKeyName || "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const suggestedApiKeyName = useMemo(() => {
    if (apiKeyName.trim()) return apiKeyName;
    if (projectName.trim()) return `${projectName.trim()} Server Key`;
    return "Primary Server Key";
  }, [apiKeyName, projectName]);

  const currentUseCase = onboardingUseCases.find((item) => item.id === useCase);

  const steps = [
    {
      title: "Create your first project",
      copy: "Give this workspace a name so the console and SDK examples feel like your real integration.",
      icon: Layers3,
      done: projectName.trim().length > 0,
    },
    {
      title: "Pick a starter use case",
      copy: "We’ll tailor the quickstart path and examples around the workflow you care about first.",
      icon: ShieldCheck,
      done: Boolean(useCase),
    },
    {
      title: "Name your first server key",
      copy: "This is the credential name your team would use from a backend service or worker.",
      icon: KeyRound,
      done: suggestedApiKeyName.trim().length > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <Rocket className="h-3.5 w-3.5" />
              Welcome to Appraise
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              Let’s get {displayName.split(" ")[0] || "you"} to a first working integration.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              This setup takes a minute or two. When you finish, we’ll drop you into a tailored quickstart with your project name, starter use case, and first API flow in mind.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5 lg:w-80">
            <p className="text-sm font-semibold text-slate-950">What you’ll finish with</p>
            <div className="mt-4 space-y-3">
              {[
                "A named Appraise project for your team",
                "A starter use case to guide docs and examples",
                "A first server key name for backend SDK usage",
                "A clean path into your first event and context request",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${step.done ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Step {index + 1}
                    </span>
                    {step.done && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                        Complete
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950">{step.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{step.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Workspace setup</h2>
              <p className="mt-1 text-sm text-slate-500">This stores your onboarding choices on your signed-in Appraise account.</p>
            </div>
            <Link href="/dashboard/quickstart" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              Skip to quickstart
            </Link>
          </div>

          <form
            className="mt-8 space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              setError(null);

              const formData = new FormData();
              formData.set("projectName", projectName);
              formData.set("companyName", companyName);
              formData.set("useCase", useCase);
              formData.set("apiKeyName", suggestedApiKeyName);

              startTransition(async () => {
                const result = await completeOnboarding(formData);
                if (result?.error) setError(result.error);
              });
            }}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Project name</label>
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Acme Support Agent"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Company name</label>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Acme"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Starter use case</label>
              <div className="grid gap-3">
                {onboardingUseCases.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUseCase(option.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      option.id === useCase
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-950">{option.label}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-600">{option.description}</div>
                      </div>
                      <div className={`h-4 w-4 rounded-full border ${option.id === useCase ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">First API key name</label>
              <input
                value={apiKeyName}
                onChange={(event) => setApiKeyName(event.target.value)}
                placeholder={projectName ? `${projectName} Server Key` : "Primary Server Key"}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
              />
              <p className="text-xs leading-6 text-slate-500">
                Suggested key: <span className="font-semibold text-slate-700">{suggestedApiKeyName}</span>
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
              <p className="text-sm font-semibold text-slate-950">What happens next</p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                <p>
                  Project: <span className="font-semibold text-slate-800">{projectName || "Your first Appraise project"}</span>
                </p>
                <p>
                  Use case: <span className="font-semibold text-slate-800">{getUseCaseLabel(useCase)}</span>
                </p>
                <p>
                  First key: <span className="font-semibold text-slate-800">{suggestedApiKeyName}</span>
                </p>
                <p>
                  Next page: <span className="font-semibold text-slate-800">Quickstart with your first event and context request</span>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving workspace..." : "Finish setup and open quickstart"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>

      {currentUseCase && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Your first Appraise path for {currentUseCase.label.toLowerCase()}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "1. Track an event",
                copy: "Send a real workflow event into Appraise so memory starts from structured product signals.",
              },
              {
                title: "2. Retrieve context",
                copy: "Call the context API before the model response and inspect what Appraise returns.",
              },
              {
                title: "3. Connect the chatbot",
                copy: "Use the returned context inside your system prompt, agent tool call, or support workflow.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-[#f7f8fb] p-5">
                <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
