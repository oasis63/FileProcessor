'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Download, ArrowRight, RefreshCw } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-md border border-paper-line dark:border-night-border bg-paper-raised dark:bg-night-raised space-y-6">
      <div className="flex items-center space-x-3 text-brand-700 dark:text-brand-400">
        <CheckCircle2 className="w-7 h-7 flex-shrink-0" />
        <div>
          <h3 className="font-display text-xl text-ink dark:text-paper">Ready to download</h3>
          <p className="text-sm text-ink-muted dark:text-paper/60">The processed file is available for one hour</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 rounded-md bg-paper dark:bg-night border border-paper-line dark:border-night-border text-center">
        <div>
          <p className="text-xs text-ink-faint font-medium">Original</p>
          <p className="text-lg font-semibold text-ink dark:text-paper mt-1">{origSizeStr}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint font-medium">Processed</p>
          <p className="text-lg font-semibold text-brand-700 dark:text-brand-400 mt-1">{procSizeStr}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint font-medium">Savings</p>
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-brand-800 dark:text-brand-300 mt-1">
            {savingsPct}% smaller
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <a
          href={downloadUrl}
          download
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white font-semibold text-base"
        >
          <Download className="w-5 h-5" /> Download file
        </a>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3.5 rounded-md border border-paper-line dark:border-night-border hover:bg-paper-muted dark:hover:bg-night text-ink dark:text-paper font-semibold text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Start over
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
