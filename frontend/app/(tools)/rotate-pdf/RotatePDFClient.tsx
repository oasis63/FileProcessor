'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function RotatePDFClient() {
  const optionsComponent = (
    options: Record<string, any>,
    setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>
  ) => {
    return (
      <div className="space-y-3 text-sm">
        <label className="font-medium text-gray-700 dark:text-gray-300 text-xs">Rotation</label>
        <div className="grid grid-cols-3 gap-3">
          {[90, 180, 270].map((degrees) => (
            <button
              key={degrees}
              type="button"
              onClick={() => setOptions({ ...options, degrees })}
              className={`p-3 rounded-xl border text-center transition-all ${
                (options.degrees || 90) === degrees
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <p className="text-xs">{degrees}°</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="rotate-pdf"
      title="Rotate PDF"
      description="Rotate every page in a PDF by 90, 180, or 270 degrees."
      accept=".pdf"
      optionsComponent={optionsComponent}
      initialOptions={{ degrees: 90 }}
      seoContent={{
        howItWorks: [
          { step: 'Upload PDF', text: 'Drop the PDF whose pages you want to rotate.' },
          { step: 'Choose angle', text: 'Select 90, 180, or 270 degrees.' },
          { step: 'Download', text: 'Get a rotated PDF you can print or share.' },
        ],
        faqs: [
          { q: 'Does rotation change PDF quality?', a: 'No. Pages are rotated in place without re-rendering the content.' },
        ],
      }}
    />
  );
}
