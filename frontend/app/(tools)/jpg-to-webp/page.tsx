'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export default function JPGToWebPPage() {
  return (
    <ToolLayout
      toolId="convert-image"
      title="JPG to WebP"
      description="Convert legacy JPEG images into lightweight next-gen WebP format."
      accept="image/jpeg,image/jpg"
      initialOptions={{ targetFormat: 'webp' }}
      seoContent={{
        howItWorks: [
          { step: 'Select JPG', text: 'Upload your JPG/JPEG image file.' },
          { step: 'Convert', text: 'Convert to high-efficiency WebP with transparency support.' },
          { step: 'Download', text: 'Save your WebP image (typically 30-40% smaller than JPG).' },
        ],
        faqs: [
          { q: 'Why convert JPG to WebP?', a: 'WebP offers superior compression for web pages, reducing load times significantly.' },
        ],
      }}
    />
  );
}
