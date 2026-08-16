'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function CropImagePage() {
  const optionsComponent = (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Width (px)</label>
          <input
            type="number"
            value={options.width || 800}
            onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Height (px)</label>
          <input
            type="number"
            value={options.height || 600}
            onChange={(e) => setOptions({ ...options, height: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">X Offset (px)</label>
          <input
            type="number"
            value={options.x || 0}
            onChange={(e) => setOptions({ ...options, x: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Y Offset (px)</label>
          <input
            type="number"
            value={options.y || 0}
            onChange={(e) => setOptions({ ...options, y: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="crop-image"
      title="Crop Image"
      description="Crop rectangular sections from photos and images."
      accept="image/*"
      optionsComponent={optionsComponent}
      initialOptions={{ width: 800, height: 600, x: 0, y: 0 }}
      seoContent={{
        howItWorks: [
          { step: 'Select Photo', text: 'Upload an image from your computer or phone.' },
          { step: 'Set Crop Box', text: 'Enter width, height, and offset coordinates.' },
          { step: 'Crop & Download', text: 'Get your cleanly cropped image.' },
        ],
        faqs: [
          { q: 'Can I crop PNG and WebP images?', a: 'Yes, cropping works seamlessly across JPG, PNG, and WebP.' },
        ],
      }}
    />
  );
}
