'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Download, Zap, Loader2, Save, FileJson, FileText, File as FileIcon } from 'lucide-react';
import { SRS_TEMPLATE, Question, Section } from '@/constants/srs-template';
import { generatePdf, generateDocx } from '@/utils/document-generator';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to merge tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SRSWizard() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1); // -1 for Project Info
  const [metadata, setMetadata] = useState({
    projectName: '',
    version: '1.0.0',
    author: '',
    projectDescription: '',
    date: new Date().toLocaleDateString('en-GB'),
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicGenerating, setMagicGenerating] = useState(false);
  const [autofillLoading, setAutofillLoading] = useState<string | null>(null);

  const currentSection = currentSectionIndex === -1 ? null : SRS_TEMPLATE[currentSectionIndex];

  const handleMetadataChange = (field: keyof typeof metadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentSectionIndex === -1) {
      if (!metadata.projectName || !metadata.version || !metadata.author || !metadata.date) {
        alert('Please fill in Project Name, Version, Author, and Date before continuing.');
        return;
      }
    }
    if (currentSectionIndex < SRS_TEMPLATE.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > -1) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleAutofill = async (question: Question) => {
    setAutofillLoading(question.id);
    try {
      const response = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.label,
          context: { ...metadata, ...answers },
          section: currentSection?.title || 'General',
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate suggestion');
      }

      if (data.suggestion) {
        handleInputChange(question.id, data.suggestion);
      }
    } catch (error: any) {
      console.error('Autofill failed:', error);
      alert(`Smart Autofill Failed: ${error.message}\n\nPlease ensure Ollama is running (ollama serve).`);
    } finally {
      setAutofillLoading(null);
    }
  };

  const handleMagicGenerate = async () => {
    if (!metadata.projectName || !metadata.projectDescription) {
      alert('Please provide a Project Name and Description for the AI to work with.');
      return;
    }
    setMagicGenerating(true);
    try {
      const response = await fetch('/api/generate-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      if (data.answers) {
        setAnswers(data.answers);
        setCurrentSectionIndex(0);
      }
    } catch (error: any) {
      console.error('Magic Generate failed:', error);
      alert(`Magic Generate Failed: ${error.message}\n\nPlease ensure Ollama is running (ollama serve) and 'phi3' is pulled.`);
    } finally {
      setMagicGenerating(false);
    }
  };

  const downloadJson = async () => {
    const rawTitle = metadata.projectName || 'SRS';
    const safeName = rawTitle.replace(/[/\\?%*:|"<>]/g, '-');

    const structuredContent = SRS_TEMPLATE.map(section => ({
      section: section.title,
      questions: section.questions.map(q => ({
        id: q.id,
        label: q.label,
        answer: answers[q.id] || ''
      }))
    }));

    const exportData = {
      metadata,
      documentation: structuredContent
    };

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${safeName}.json`, content: exportData, type: 'json' })
      });
      if (!res.ok) throw new Error("Failed backend export");
      alert(`Success: ${safeName}.json was saved perfectly to your Downloads folder!`);
    } catch (err) {
      console.error("Local save failed", err);
      alert("Could not force-save to Downloads folder. Is the Next.js server running?");
    }
  };

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      generatePdf({ ...metadata, ...answers });
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsGenerating(true);
    try {
      await generateDocx({ ...metadata, ...answers });
    } catch (error) {
      console.error('Word generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = ((currentSectionIndex + 2) / (SRS_TEMPLATE.length + 1)) * 100;

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky High-Contrast Header bar */}
      <div className="sticky top-0 z-50 bg-[#FFFFFF] shadow-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-12 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-[4px] bg-white text-[#808080] flex items-center justify-center">
              <FileIcon className="w-4 h-4" />
            </div>
            <span className="text-white font-black text-sm uppercase tracking-[0.3em]">SRS ARCHITECT</span>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
            Progress: Step {currentSectionIndex + 2} of {SRS_TEMPLATE.length + 1}
          </span>
        </div>
        {/* Progress bar line at the base of the navy header */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
          <motion.div
            className="h-full bg-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-72 flex flex-col gap-2 border-r border-[#E2E8F0] pr-8">
            <button
              onClick={() => setCurrentSectionIndex(-1)}
              className={cn(
                "text-left px-5 py-4 transition-all text-xs font-bold uppercase tracking-widest rounded-[4px]",
                currentSectionIndex === -1
                  ? "bg-[#808080] text-white"
                  : "text-slate-400 hover:text-[#000000] hover:bg-slate-50"
              )}
            >
              00. PROJECT OVERVIEW
            </button>
            {SRS_TEMPLATE.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSectionIndex(index)}
                className={cn(
                  "text-left px-5 py-4 transition-all text-xs font-bold uppercase tracking-widest rounded-[4px]",
                  index === currentSectionIndex
                    ? "bg-[#808080] text-white"
                    : "text-slate-400 hover:text-[#0A192F] hover:bg-slate-50"
                )}
              >
                {(index + 1).toString().padStart(2, '0')}. {section.title.split('. ')[1]}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {currentSectionIndex === -1 ? (
                <motion.div
                  key="metadata-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1"
                >
                  <div className="mb-12">
                    <h2 className="text-4xl font-black text-[#0A192F] tracking-tight mb-4 uppercase">
                      Software Configuration
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl font-medium">
                      Establish the technical foundation for your Software Requirements Specification (SRS) following the IEEE 830 standard.
                    </p>
                  </div>

                  <div className="grid gap-12 max-w-3xl pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.2em]">Project Name (Mandatory)</label>
                        <input
                          type="text"
                          value={metadata.projectName}
                          onChange={(e) => handleMetadataChange('projectName', e.target.value)}
                          placeholder="ENTER PROJECT NAME"
                          className="input-field"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.2em]">Version</label>
                          <input
                            type="text"
                            value={metadata.version}
                            onChange={(e) => handleMetadataChange('version', e.target.value)}
                            placeholder="VERSION 1.0.0"
                            className="input-field"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.2em]">Author</label>
                          <input
                            type="text"
                            value={metadata.author}
                            onChange={(e) => handleMetadataChange('author', e.target.value)}
                            placeholder="AUTHOR/ORG"
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.2em]">Publication Date</label>
                      <input
                        type="text"
                        value={metadata.date}
                        onChange={(e) => handleMetadataChange('date', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.2em]">Product Overview</label>
                      <textarea
                        value={metadata.projectDescription}
                        onChange={(e) => handleMetadataChange('projectDescription', e.target.value)}
                        placeholder="Describe the overall goals and intent of the product..."
                        className="textarea-standard h-[180px]"
                      />
                    </div>

                    <div className="pt-10 flex flex-col gap-6">
                      <button
                        onClick={handleMagicGenerate}
                        disabled={magicGenerating}
                        className="btn-standard py-6 text-xl tracking-[0.1em]"
                      >
                        {magicGenerating ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            PROCESSING SPECIFICATIONS...
                          </span>
                        ) : (
                          "GENERATE SRS USING 'MAGIC GENERATE'"
                        )}
                      </button>

                      <button
                        onClick={handleNext}
                        className="text-slate-400 hover:text-[#0A192F] font-bold text-xs uppercase tracking-[0.2em] transition-colors"
                      >
                        Generate SRS Document Manually
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : currentSection ? (
                <motion.div
                  key={currentSection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-1 space-y-6"
                >
                  <div className="space-y-16">
                    <div className="pb-6 border-b border-slate-100">
                      <h2 className="text-4xl font-black text-[#0A192F] uppercase tracking-tight">{currentSection.title}</h2>
                    </div>
                    <div className="space-y-20">
                      {currentSection.questions.map((q) => (
                        <div key={q.id} className="card-layout">
                          <div className="flex justify-between items-center mb-6">
                            <label className="text-xs font-black text-[#0A192F] uppercase tracking-[0.25em]">{q.label}</label>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleInputChange(q.id, '')}
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors"
                              >
                                Clear
                              </button>
                              <button
                                onClick={() => handleAutofill(q)}
                                disabled={autofillLoading === q.id}
                                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0A192F] hover:text-[#1E3A8A] transition-colors"
                              >
                                {autofillLoading === q.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3" />
                                )}
                                Autocomplete
                              </button>
                            </div>
                          </div>
                          {q.description && (
                            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">{q.description}</p>
                          )}
                          <textarea
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder={q.placeholder}
                            className={cn(
                              "textarea-standard",
                              q.label.toLowerCase().includes('purpose') && "h-[120px]"
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-20 flex items-center justify-between py-12 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={currentSectionIndex === -1}
                className={cn(
                  "flex items-center gap-2 px-8 py-3 rounded-[4px] transition-all font-bold text-xs uppercase tracking-widest",
                  currentSectionIndex === -1 ? "opacity-0 pointer-events-none" : "hover:bg-slate-50 text-slate-400 hover:text-[#0A192F]"
                )}
              >
                <ChevronLeft className="w-4 h-4" /> Previous Section
              </button>

              <div className="flex gap-6">
                {currentSectionIndex === SRS_TEMPLATE.length - 1 ? (
                  <div className="flex gap-4">
                    <button onClick={downloadJson} className="btn-secondary">
                      <FileJson className="w-4 h-4" /> Export
                    </button>
                    <button onClick={handleDownloadDocx} className="btn-secondary">
                      <FileIcon className="w-4 h-4" /> Word
                    </button>
                    <button onClick={handleDownloadPdf} className="btn-standard px-10">
                      <FileText className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                ) : (
                  <button onClick={handleNext} className="btn-standard">
                    Submit and Continue <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
