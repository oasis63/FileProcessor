'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function RemovePDFMetadataClient() {
  return (
    <ToolLayout
      toolId="remove-pdf-metadata"
      title="Remove PDF Metadata"
      description="Strip author, title, and producer tags from a PDF before sharing."
      accept=".pdf"
      seoContent={{
        howItWorks: [
          { step: 'Upload PDF', text: 'Choose the PDF that contains hidden document properties.' },
          { step: 'Clean', text: 'We rewrite the PDF without author, title, and producer metadata.' },
          { step: 'Download', text: 'Share the cleaned file without leaking document properties.' },
        ],
        faqs: [
          { q: 'What metadata is removed?', a: 'Standard document info such as author, title, and producer is stripped during the rewrite.' },
        ],
      }}
    />
  );
}
