'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { Job } from '@/types';
import { getDownloadUrl } from '@/lib/api-client';

interface ResultCardProps {
  job: Job;
  onReset: () => void;
  nextActions?: Array<{ label: string; href: string }>;
}

export function ResultCard({ job, onReset, nextActions }: ResultCardProps) {
  const downloadUrl = getDownloadUrl(job.id);
  const origSizeStr = formatBytes(job.originalSize);
  const procSizeStr = formatBytes(job.processedSize);
  const savingsPct = Math.round(job.savingsPct || 0);

  const defaultNextActions = job.toolId.includes('pdf')
    ? [
        { label: 'Merge PDF', href: '/merge-pdf' },
        { label: 'PDF to JPG', href: '/pdf-to-jpg' },
        { label: 'Compress Another', href: '#' },
      ]
    : [
        { label: 'Resize Image', href: '/resize-image' },
        { label: 'Convert to WebP', href: '/jpg-to-webp' },
        { label: 'Compress Another', href: '#' },
      ];

  const actions = nextActions || defaultNextActions;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-8 h-8 flex-shrink-0 animate-bounce" />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Processing Complete!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your output file is ready for download</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Original</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-1">{origSizeStr}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Processed</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{procSizeStr}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Savings</p>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 mt-1">
            <Sparkles className="w-3 h-3" /> {savingsPct}% Smaller
          </span>
        </div>
      </div>

      {/* Primary Download Button */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={downloadUrl}
          download
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Download className="w-5 h-5" /> Download File
        </a>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-4 rounded-2xl border border-gray-300 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Start Over
        </button>
      </div>

      {/* Next Action Suggestions */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Suggested Next Actions
        </p>
        <div className="flex flex-wrap gap-2">
          {actions.map((act, i) =>
            act.href === '#' ? (
              <button
                key={i}
                onClick={onReset}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
              >
                {act.label} <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            ) : (
              <Link
                key={i}
                href={act.href}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-1.5 transition-colors"
              >
                {act.label} <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
