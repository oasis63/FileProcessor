'use client';

import React, { useState } from 'react';
import { FileDropzone } from '../upload/FileDropzone';
import { ResultCard } from './ResultCard';
import { Job, FileMetadata } from '@/types';
import { uploadFiles, createJob, getJobStatus } from '@/lib/api-client';
import { Loader2, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface ToolLayoutProps {
  toolId: string;
  title: string;
  description: string;
  accept?: string;
  multiple?: boolean;
  optionsComponent?: (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => React.ReactNode;
  initialOptions?: Record<string, any>;
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
  seoContent,
}: ToolLayoutProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>(initialOptions);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobProgress, setJobProgress] = useState(0);
  const [completedJob, setCompletedJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartProcessing = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setError(null);
    setJobProgress(10);

    try {
      // 1. Upload files
      const uploadedMetas: FileMetadata[] = await uploadFiles(selectedFiles);
      setJobProgress(40);

      // 2. Create job
      const job: Job = await createJob(toolId, uploadedMetas, options);
      setJobProgress(60);

      // 3. Poll status until finished
      const pollInterval = setInterval(async () => {
        try {
          const updated = await getJobStatus(job.id);
          setJobProgress(updated.progress || 75);

          if (updated.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setCompletedJob(updated);
            setIsProcessing(false);
          } else if (updated.status === 'FAILED') {
            clearInterval(pollInterval);
            setError(updated.error?.message || 'Processing failed');
            setIsProcessing(false);
          }
        } catch (pollErr) {
          clearInterval(pollInterval);
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
      {/* Tool Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
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
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Processing Options
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
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-50"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="flex flex-col items-center space-y-1">
          <Zap className="w-6 h-6 text-blue-500" />
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Ultra-Fast Processing</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Powered by native Go engine</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">100% Secure & Private</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Files automatically deleted after 1h</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <HelpCircle className="w-6 h-6 text-purple-500" />
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">No Account Required</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Free forever with zero registration</p>
        </div>
      </div>

      {/* SEO & FAQ Content */}
      {seoContent && (
        <div className="pt-12 border-t border-gray-200 dark:border-gray-800 space-y-12">
          {/* How it works */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to {title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seoContent.howItWorks.map((step, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{step.step}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {seoContent.faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-1">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{faq.q}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
