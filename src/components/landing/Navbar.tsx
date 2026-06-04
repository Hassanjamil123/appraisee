"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 border-b border-border-subtle backdrop-blur-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple opacity-40 blur-sm group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-surface-1 p-1.5 rounded-lg border border-border-subtle">
              <Brain className="w-5 h-5 text-accent-blue group-hover:text-accent-purple transition-colors duration-300" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Appraise<span className="text-accent-blue">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            Workflow
          </a>
          <Link
            href="/pricing"
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-sm text-text-secondary hover:text-white transition-colors"
          >
            Docs
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="relative group overflow-hidden rounded-lg p-[1px] focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple" />
            <span className="relative block px-4 py-1.5 bg-black hover:bg-black/90 transition-colors duration-300 text-xs font-semibold text-white rounded-[7px]">
              Start Building
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-text-secondary hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border-subtle bg-black/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="text-base text-text-secondary hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#workflow"
                onClick={() => setIsOpen(false)}
                className="text-base text-text-secondary hover:text-white transition-colors"
              >
                Workflow
              </a>
              <Link
                href="/pricing"
                onClick={() => setIsOpen(false)}
                className="text-base text-text-secondary hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                onClick={() => setIsOpen(false)}
                className="text-base text-text-secondary hover:text-white transition-colors"
              >
                Docs
              </Link>
              <div className="h-[1px] bg-border-subtle" />
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-base text-text-secondary hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-2.5 bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-semibold text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Building
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
