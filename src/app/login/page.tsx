"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Brain, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signInWithEmail, signInWithOAuth } from "@/lib/auth-actions";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f8fb]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const email = searchParams.get("email") || "";
  const invite = searchParams.get("invite");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signInWithEmail(formData);
      if (result?.error) setError(result.error);
    });
  }

  async function handleOAuth(provider: "google" | "github") {
    startTransition(async () => {
      const result = await signInWithOAuth(provider, redirectTo);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left — Dark brand panel */}
      <div className="hidden lg:flex w-[52%] bg-white text-slate-950 border-r border-slate-200 p-14 flex-col justify-between relative overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: "rgba(59,130,246,0.08)" }} />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Appraise.</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <blockquote className="text-[2rem] font-extrabold leading-[1.2] tracking-tight text-slate-950 max-w-xs">
            &ldquo;The context layer your AI has been missing.&rdquo;
          </blockquote>
          <div className="space-y-3">
            {[
              "Operational context across all sessions",
              "Workflow-aware context retrieval",
              "Agent workflow orchestration",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {["SC", "MJ", "AT"].map((initials, i) => (
            <div
              key={initials}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
              style={{
                marginLeft: i > 0 ? "-10px" : 0,
                background: `hsl(${220 + i * 30}, 70%, 55%)`,
                zIndex: 3 - i,
              }}
            >
              {initials}
            </div>
          ))}
          <span className="text-[11px] text-slate-500 ml-1">
            Trusted by 2,000+ developers
          </span>
        </div>
      </div>

      {/* Right — Light form panel */}
      <div className="flex-grow flex items-center justify-center bg-[#f8f8fb] p-6 relative">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-[360px] relative z-10 space-y-7">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Appraise.</span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-1">
              {invite === "team" ? "Sign in to accept your team invitation" : "Sign in to your console"}
            </p>
          </div>

          {/* Error display */}
          {(error || urlError) && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error || (urlError === "auth_callback_failed" ? "Authentication failed. Please try again." : urlError)}
            </div>
          )}

          {invite === "team" && (
            <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 font-medium">
              Use the invited email address to join the Appraise workspace, then open Settings and accept the invitation.
            </div>
          )}

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth("google")}
              disabled={isPending}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-xs font-semibold text-gray-700 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              onClick={() => handleOAuth("github")}
              disabled={isPending}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-xs font-semibold text-gray-700 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue={email}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all shadow-md shadow-gray-900/20 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            No account?{" "}
            <Link
              href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}${invite ? `&invite=${encodeURIComponent(invite)}` : ""}`}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
