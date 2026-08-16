'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function JPGToPDFPage() {
  return (
    <ToolLayout
      toolId="image-to-pdf"
      title="JPG to PDF"
      description="Convert JPG, PNG, or WebP images into a single PDF document."
      accept="image/*"
      multiple={true}
      seoContent={{
        howItWorks: [
          { step: 'Select Images', text: 'Upload one or multiple JPG, PNG, or WebP images.' },
          { step: 'Convert', text: 'ImageMagick compiles them into formatted PDF pages.' },
          { step: 'Download PDF', text: 'Get your clean PDF file instantly.' },
        ],
        faqs: [
          { q: 'Can I combine multiple photos into one PDF?', a: 'Yes! Select multiple photos and they will be compiled into a multi-page PDF.' },
        ],
      }}
    />
  );
}
