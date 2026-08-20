'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FileDropzone } from '../upload/FileDropzone';
import { ResultCard } from './ResultCard';
import { Job, FileMetadata } from '@/types';
import { uploadFiles, createJob, getJobStatus } from '@/lib/api-client';
import { generateWebApplicationSchema, generateFAQSchema } from '@/lib/seo';
import { takePendingFiles } from '@/lib/pending-files';
import { Loader2, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface ToolLayoutProps {
  toolId: string;
  title: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  optionsComponent?: (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => React.ReactNode;
  initialOptions?: Record<string, any>;
  resolveToolId?: (options: Record<string, any>) => string;
  validate?: (files: File[], options: Record<string, any>) => string | null;
  seoContent?: {
    howItWorks: Array<{ step: string; text: string }>;
    faqs: Array<{ q: string; a: string }>;
  };
}

export function ToolLayout({
  toolId,
  title,
  description,
  accept = '*/*',
  multiple = false,
  optionsComponent,
  initialOptions = {},
  resolveToolId,
  validate,
  seoContent,
}: ToolLayoutProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>(initialOptions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobProgress, setJobProgress] = useState(0);
  const [completedJob, setCompletedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pending = takePendingFiles();
    if (pending.length > 0) {
      setSelectedFiles(multiple ? pending : pending.slice(0, 1));
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [multiple]);

  const appSchema = generateWebApplicationSchema(title, description, `/${toolId}`);
  const faqSchema = seoContent ? generateFAQSchema(seoContent.faqs) : null;

  const handleStartProcessing = async () => {
    if (selectedFiles.length === 0) return;
    const validationError = validate?.(selectedFiles, options);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setJobProgress(10);

    try {
      const uploadedMetas: FileMetadata[] = await uploadFiles(selectedFiles);
      setJobProgress(40);

      const activeToolId = resolveToolId ? resolveToolId(options) : toolId;
      const job: Job = await createJob(activeToolId, uploadedMetas, options);
      setJobProgress(60);

      if (pollRef.current) {
        clearInterval(pollRef.current);
      }

      pollRef.current = setInterval(async () => {
        try {
          const updated = await getJobStatus(job.id);
          setJobProgress(updated.progress || 75);

          if (updated.status === 'COMPLETED') {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            setCompletedJob(updated);
            setIsProcessing(false);
          } else if (updated.status === 'FAILED') {
            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = null;
            setError(updated.error?.message || 'Processing failed');
            setIsProcessing(false);
          }
        } catch {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setError('Failed to fetch processing status');
          setIsProcessing(false);
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during processing');
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setCompletedJob(null);
    setError(null);
    setIsProcessing(false);
    setJobProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Tool Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-ink dark:text-paper tracking-tight">
          {title}
        </h1>
        <p className="text-base text-ink-muted dark:text-paper/70">
          {description}
        </p>
      </div>

      {/* Main Tool Area */}
      <div className="w-full">
        {completedJob ? (
          <ResultCard job={completedJob} onReset={handleReset} />
        ) : (
          <div className="space-y-6">
            {/* Dropzone */}
            <FileDropzone
              accept={accept}
              multiple={multiple}
              files={selectedFiles}
              onFilesSelected={setSelectedFiles}
              onRemoveFile={(idx) => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
              disabled={isProcessing}
            />

            {/* Custom Options Panel */}
            {selectedFiles.length > 0 && optionsComponent && (
              <div className="p-5 rounded-md border border-paper-line dark:border-night-border bg-paper-raised dark:bg-night-raised space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                  Options
                </h3>
                {optionsComponent(options, setOptions)}
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Primary Submit Button */}
            {selectedFiles.length > 0 && (
              <button
                onClick={handleStartProcessing}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-md bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400 text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing ({jobProgress}%)...
                  </>
                ) : (
                  <>
                    {title} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-paper-line dark:border-night-border text-center">
        <div className="flex flex-col items-center space-y-1">
          <Zap className="w-5 h-5 text-brand-600" />
          <p className="text-sm font-semibold text-ink dark:text-paper">Fast native processing</p>
          <p className="text-xs text-ink-muted">Go workers, not a browser script</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <p className="text-sm font-semibold text-ink dark:text-paper">Deleted after an hour</p>
          <p className="text-xs text-ink-muted">Nothing is kept on the server</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <HelpCircle className="w-5 h-5 text-brand-600" />
          <p className="text-sm font-semibold text-ink dark:text-paper">No account</p>
          <p className="text-xs text-ink-muted">Use the tool and download the file</p>
        </div>
      </div>

      {/* SEO & FAQ Content */}
      {seoContent && (
        <div className="pt-12 border-t border-paper-line dark:border-night-border space-y-12">
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-ink dark:text-paper">How to {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {seoContent.howItWorks.map((step, i) => (
                <div key={i} className="p-5 rounded-md border border-paper-line dark:border-night-border bg-paper-raised dark:bg-night-raised space-y-2">
                  <div className="text-xs font-semibold text-brand-700 dark:text-brand-400">{i + 1}</div>
                  <h4 className="font-semibold text-sm text-ink dark:text-paper">{step.step}</h4>
                  <p className="text-sm text-ink-muted dark:text-paper/60 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl text-ink dark:text-paper">Questions</h2>
            {seoContent.faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-md border border-paper-line dark:border-night-border bg-paper-raised dark:bg-night-raised space-y-1">
                <h4 className="font-semibold text-sm text-ink dark:text-paper">{faq.q}</h4>
                <p className="text-sm text-ink-muted dark:text-paper/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
