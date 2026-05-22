'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import SRSWizard from '@/components/SRS-Wizard';

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen relative bg-white text-slate-900">
      {/* clean, minimal background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 border-l border-[#E2E8F0]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {!started ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#FFFFFF] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                IEEE 830 STANDARD
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0A192F] leading-[0.9] uppercase">
                SRS <br />
                <span className="text-slate-400">ARCHITECT</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <button
                onClick={() => setStarted(true)}
                className="btn-standard min-w-[280px] py-6 text-base"
              >
                INITIALIZE GENERATION <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/guide"
                className="btn-secondary min-w-[240px] py-6 text-base"
              >
                TECHNICAL GUIDE
              </Link>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
              <button
                onClick={() => setStarted(false)}
                className="text-slate-500 hover:text-[#0A192F] transition-all font-semibold flex items-center gap-2 group text-sm uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-widest text-right">
                Workspace: SRS Generation
              </div>
            </div>
            <SRSWizard />
          </motion.div>
        )}
      </div>
    </main>
  );
}
