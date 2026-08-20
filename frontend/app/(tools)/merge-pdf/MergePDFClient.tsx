'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function MergePDFClient() {
  return (
    <ToolLayout
      toolId="merge-pdf"
      title="Merge PDF"
      description="Combine multiple PDF files into one clean unified document."
      accept=".pdf"
      multiple={true}
      seoContent={{
        howItWorks: [
          { step: 'Select Multiple PDFs', text: 'Drag two or more PDF files into the upload area.' },
          { step: 'Order Documents', text: 'Files will be merged in the order they were selected.' },
          { step: 'Merge & Download', text: 'Click Merge PDF to produce a single combined document.' },
        ],
        faqs: [
          { q: 'Is there a limit on how many PDFs I can merge?', a: 'You can merge up to 50 PDF files at once for free.' },
        ],
      }}
    />
  );
}
