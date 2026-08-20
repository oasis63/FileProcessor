'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function ResizeImageClient() {
  const optionsComponent = (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    return (
      <div className="space-y-6 text-sm">
        {/* Preset dimension buttons */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700 dark:text-gray-300 text-xs">Resize Presets</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Instagram Square', w: 1080, h: 1080 },
              { label: 'Full HD Web', w: 1920, h: 1080 },
              { label: 'LinkedIn Cover', w: 1584, h: 396 },
              { label: 'Passport Photo', w: 600, h: 600 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setOptions({ ...options, width: p.w, height: p.h })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  options.width === p.w && options.height === p.h
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <p className="text-xs font-bold">{p.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.w} × {p.h} px</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Width / Height */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Width (px)</label>
            <input
              type="number"
              value={options.width || 1920}
              onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Height (px)</label>
            <input
              type="number"
              value={options.height || 1080}
              onChange={(e) => setOptions({ ...options, height: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="resize-image"
      title="Resize Image"
      description="Change image resolution for social media, websites, or documents."
      accept="image/*"
      optionsComponent={optionsComponent}
      initialOptions={{ width: 1920, height: 1080 }}
      seoContent={{
        howItWorks: [
          { step: 'Upload Image', text: 'Select an image from your computer or phone.' },
          { step: 'Select Dimension', text: 'Pick a preset like Instagram Post or type custom pixel dimensions.' },
          { step: 'Resize & Download', text: 'Get your perfectly scaled image in one click.' },
        ],
        faqs: [
          { q: 'Will aspect ratio be preserved?', a: 'Yes! ImageMagick automatically preserves aspect ratio unless forced otherwise.' },
        ],
      }}
    />
  );
}
