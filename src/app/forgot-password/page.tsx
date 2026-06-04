"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Brain, ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/auth-actions";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left — Dark panel */}
      <div className="hidden lg:flex w-[52%] bg-white text-slate-950 border-r border-slate-200 p-14 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(15,23,42,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)" }} />

        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Appraise.</span>
        </Link>

        <div className="relative z-10">
          <p className="text-4xl font-extrabold leading-tight tracking-tight text-slate-950">Account<br />recovery.</p>
          <p className="text-sm text-slate-500 mt-4 max-w-xs leading-relaxed">
            We&apos;ll send a secure link to your inbox to reset your credentials and regain access.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400">
          © {new Date().getFullYear()} Appraise, Inc.
        </div>
      </div>

      {/* Right — Light form panel */}
      <div className="flex-grow flex items-center justify-center bg-[#f8f8fb] p-6 relative">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="w-full max-w-[360px] relative z-10 space-y-7">
          <Link href="/" className="flex items-center gap-2 lg:hidden mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Appraise.</span>
          </Link>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reset password</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send a reset link</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isPending || !!success}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white transition-all shadow-md shadow-gray-900/20 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
            </button>
          </form>

          <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
