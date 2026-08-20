'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function CompressPDFClient() {
  const optionsComponent = (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    const isTargetMode = options.mode === 'target';

    return (
      <div className="space-y-6 text-sm">
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setOptions({ ...options, mode: 'preset' })}
            className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
              !isTargetMode
                ? 'bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Preset Quality
          </button>
          <button
            type="button"
            onClick={() => setOptions({ ...options, mode: 'target', targetBytes: 2 * 1024 * 1024 })}
            className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
              isTargetMode
                ? 'bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Target Size (MB)
          </button>
        </div>

        {!isTargetMode ? (
          <div className="space-y-3">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-xs">Compression Level</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Maximum Quality', value: 'printer', desc: 'Minimal compression' },
                { label: 'Balanced', value: 'ebook', desc: 'Best size-to-quality ratio' },
                { label: 'Max Compression', value: 'screen', desc: 'Smallest file size' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setOptions({ ...options, preset: item.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    (options.preset || 'ebook') === item.value
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 font-semibold'
                      : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <p className="text-xs">{item.label}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-xs">Make PDF under:</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 5, 10].map((mb) => {
                const bytes = mb * 1024 * 1024;
                return (
                  <button
                    key={mb}
                    type="button"
                    onClick={() => setOptions({ ...options, targetBytes: bytes })}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      options.targetBytes === bytes
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Under {mb} MB
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="compress-pdf"
      title="Compress PDF"
      description="Reduce your PDF size while preserving full visual clarity."
      accept=".pdf"
      optionsComponent={optionsComponent}
      initialOptions={{ preset: 'ebook' }}
      resolveToolId={(opts) => (opts.mode === 'target' ? 'target-size-pdf' : 'compress-pdf')}
      seoContent={{
        howItWorks: [
          { step: 'Select PDF', text: 'Upload your PDF document by dragging it into the dropzone.' },
          { step: 'Choose Compression', text: 'Select balanced preset or enter your target file size.' },
          { step: 'Download PDF', text: 'Get your compressed PDF immediately with reduced file size.' },
        ],
        faqs: [
          { q: 'Does compressing a PDF affect its quality?', a: 'FileProcessor uses intelligent Ghostscript and pdfcpu optimization to maintain high font and visual readability while stripping redundant objects.' },
          { q: 'Is my uploaded PDF document safe?', a: 'Yes! All uploaded PDF files are processed in isolated memory and automatically destroyed after 1 hour.' },
        ],
      }}
    />
  );
}
