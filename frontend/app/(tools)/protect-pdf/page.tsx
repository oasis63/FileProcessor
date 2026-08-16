'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function ProtectPDFPage() {
  const optionsComponent = (options: Record<string, any>, setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>) => {
    return (
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Set PDF Password</label>
        <input
          type="password"
          placeholder="Enter secure password"
          value={options.password || ''}
          onChange={(e) => setOptions({ ...options, password: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
      </div>
    );
  };

  return (
    <ToolLayout
      toolId="protect-pdf"
      title="Protect PDF"
      description="Encrypt your PDF document with a strong password."
      accept=".pdf"
      optionsComponent={optionsComponent}
      initialOptions={{ password: '' }}
      seoContent={{
        howItWorks: [
          { step: 'Select PDF', text: 'Choose the PDF you want to password protect.' },
          { step: 'Enter Password', text: 'Set a strong password for opening and editing.' },
          { step: 'Encrypt & Download', text: 'Download your AES-encrypted secure PDF.' },
        ],
        faqs: [
          { q: 'What encryption standard is used?', a: 'pdfcpu applies AES-256 standard encryption algorithms.' },
        ],
      }}
    />
  );
}
