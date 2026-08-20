'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function SplitPDFClient() {
  return (
    <ToolLayout
      toolId="split-pdf"
      title="Split PDF"
      description="Separate PDF pages into individual documents."
      accept=".pdf"
      seoContent={{
        howItWorks: [
          { step: 'Upload PDF', text: 'Select the PDF file you wish to split.' },
          { step: 'Split Pages', text: 'pdfcpu extracts every single page cleanly.' },
          { step: 'Download ZIP', text: 'Download a ZIP file with all split PDF pages.' },
        ],
        faqs: [
          { q: 'Can I split password-protected PDFs?', a: 'You will need to unlock the file first before splitting.' },
        ],
      }}
    />
  );
}
