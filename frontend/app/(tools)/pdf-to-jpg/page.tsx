'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function PDFToJPGPage() {
  return (
    <ToolLayout
      toolId="pdf-to-jpg"
      title="PDF to JPG"
      description="Extract PDF pages and save them as high-resolution JPG images."
      accept=".pdf"
      seoContent={{
        howItWorks: [
          { step: 'Upload PDF', text: 'Select the PDF document you want to extract images from.' },
          { step: 'Process', text: 'Poppler Engine converts each page into a 150 DPI JPEG photo.' },
          { step: 'Download ZIP', text: 'Download a ZIP archive containing all extracted page images.' },
        ],
        faqs: [
          { q: 'What resolution will the resulting images be?', a: 'All pages are rendered at crisp 150 DPI print-ready quality.' },
        ],
      }}
    />
  );
}
