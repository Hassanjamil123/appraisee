"use client";

import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-border-subtle pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo brand block */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-surface-2 p-1 rounded-lg border border-border-subtle">
                <Brain className="w-4 h-4 text-accent-blue" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">Appraise.</span>
            </Link>
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed mb-6">
              Turn stateless AI apps into context-aware systems with operational memory, workflow signals, and decision-ready context.
            </p>
            <div className="flex gap-4 text-text-tertiary">
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">Console</Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Changelog</a>
              </li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Developers</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">API Reference</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">TypeScript SDK</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">Python SDK</Link>
              </li>
            </ul>
          </div>

          {/* Links col 3 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-xs text-text-secondary">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Security</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-[1px] bg-border-subtle mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-text-tertiary">
          <span>&copy; {new Date().getFullYear()} Appraise Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
