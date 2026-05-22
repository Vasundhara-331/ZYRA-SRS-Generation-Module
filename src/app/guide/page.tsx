'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ScrollText, Zap, CheckCircle, ChevronLeft, FileText, Shield } from 'lucide-react';

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* High-Contrast Header bar */}
      <div className="sticky top-0 z-50 bg-[#FFFFFF] shadow-lg">
        <div className="max-w-7xl mx-auto px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-[4px] bg-white/10 flex items-center justify-center">
            </div>
            <span className="text-white font-black text-sm uppercase tracking-[0.3em]">TECHNICAL GUIDE</span>
          </div>
          <Link
            href="/"
            className="text-[10px] font-black text-white hover:text-blue-400 uppercase tracking-[0.2em] whitespace-nowrap bg-white/5 px-4 py-2 rounded-[4px] transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-slate-100 text-[#0A192F] text-[10px] font-black uppercase tracking-[0.2em]">
              Documentation Standard
            </div>
            <h1 className="text-5xl font-black text-[#0A192F] uppercase tracking-tight">Technical Architecture Guide</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              Master the art of enterprise-grade software requirements specification using the IEEE 830 protocol.
            </p>
          </div>

          <div className="grid gap-12 pt-8">
            <section className="p-8 border border-slate-100 rounded-[4px] bg-slate-50/50 space-y-6">
              <div className="flex items-center gap-3 text-[#0A192F]">
                <h2 className="text-lg font-black uppercase tracking-widest">1. IEEE 830 PROTOCOL</h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                The Institute of Electrical and Electronics Engineers (IEEE) 830 standard is the definitive framework for software requirements.
                Our system strictly adheres to this schema, ensuring that every generated document includes a professional title page,
                automated table of contents, and standardized section numbering (1.0 Introduction, 2.0 Overall Description, etc.).
              </p>
            </section>

            <section className="p-8 border border-slate-100 rounded-[4px] space-y-6">
              <div className="flex items-center gap-3 text-[#0A192F]">
                <h2 className="text-lg font-black uppercase tracking-widest">2. MAGIC GENERATE ENGINE</h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our "Magic Generate" feature utilizes locally hosted inference models (Ollama) to synthesize full-stack requirements from minimal user input.
                By providing a high-level project vision, the engine automatically architects:
              </p>
              <ul className="grid sm:grid-cols-2 gap-6">
                {['1. Functional Specifications', '2. Performance Requirements', '3. Security Protocols', '4. Hardware Interfaces'].map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    {feat}
                  </li>
                ))}
              </ul>
            </section>

            <section className="p-8 border border-slate-100 rounded-[4px] bg-[#FFFFFF] text-white space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black uppercase tracking-widest">3. BEST PRACTICES</h2>
              </div>
              <div className="space-y-4 opacity-90">
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Be Measurable</h4>
                  <p className="text-sm">Avoid vague terms like "fast" or "user-friendly". Specify response times (e.g., &lt;200ms) or accessibility standards (e.g., WCAG 2.1).</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Active Voice</h4>
                  <p className="text-sm">Write "The system shall display X" rather than "X will be displayed by the system".</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Contextual Clarity</h4>
                  <p className="text-sm">Define all technical acronyms in the "Definitions and Abbreviations" section generated by the system.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="pt-12 border-t border-slate-100 flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-[#0A192F] font-black text-xs uppercase tracking-widest transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
