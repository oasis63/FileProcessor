'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function CompressImageClient() {
  const optionsComponent = (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    const isTargetMode = options.mode === 'target';

    return (
      <div className="space-y-6 text-sm">
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setOptions({ ...options, mode: 'quality' })}
            className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
              !isTargetMode
                ? 'bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Quality %
          </button>
          <button
            type="button"
            onClick={() => setOptions({ ...options, mode: 'target', targetBytes: 500 * 1024 })}
            className={`py-2 rounded-lg font-semibold text-xs transition-colors ${
              isTargetMode
                ? 'bg-white dark:bg-gray-900 text-brand-700 dark:text-brand-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Target Size (KB/MB)
          </button>
        </div>

        {!isTargetMode ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-medium text-gray-700 dark:text-gray-300">Image Quality Level</label>
              <span className="font-bold text-brand-700 dark:text-brand-400">{options.quality || 75}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              step="5"
              value={options.quality || 75}
              onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-700"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Smallest file (10%)</span>
              <span>Balanced (75%)</span>
              <span>Best quality (95%)</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="font-medium text-gray-700 dark:text-gray-300 text-xs">Make image under:</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '200 KB', bytes: 200 * 1024 },
                { label: '500 KB', bytes: 500 * 1024 },
                { label: '1 MB', bytes: 1024 * 1024 },
                { label: '2 MB', bytes: 2 * 1024 * 1024 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setOptions({ ...options, targetBytes: item.bytes })}
                  className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    options.targetBytes === item.bytes
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Under {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="compress-image"
      title="Compress Image"
      description="Shrink JPG, PNG, WebP, and HEIC file size without losing quality."
      accept="image/*,.heic"
      optionsComponent={optionsComponent}
      initialOptions={{ quality: 75 }}
      resolveToolId={(opts) => (opts.mode === 'target' ? 'target-size-image' : 'compress-image')}
      seoContent={{
        howItWorks: [
          { step: 'Drop Image', text: 'Select or drag your JPG, PNG, WebP, or HEIC photo.' },
          { step: 'Set Target or Quality', text: 'Adjust compression slider or pick a target size under 500 KB.' },
          { step: 'Download', text: 'Save your optimized, lightweight image instantly.' },
        ],
        faqs: [
          { q: 'Which image formats are supported?', a: 'FileProcessor supports JPG, JPEG, PNG, WebP, and iPhone HEIC photos.' },
          { q: 'Is metadata removed during compression?', a: 'Yes! EXIF camera metadata and location tags are automatically stripped to reduce size and safeguard privacy.' },
        ],
      }}
    />
  );
}
