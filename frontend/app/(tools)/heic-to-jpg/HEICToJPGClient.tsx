'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function HEICToJPGClient() {
  return (
    <ToolLayout
      toolId="convert-image"
      title="HEIC to JPG"
      description="Convert iPhone HEIC photos to standard JPG format compatible everywhere."
      accept=".heic,image/heic,image/heif"
      initialOptions={{ targetFormat: 'jpg' }}
      seoContent={{
        howItWorks: [
          { step: 'Select HEIC Photos', text: 'Upload HEIC files directly from your iPhone or Mac.' },
          { step: 'Convert', text: 'Our engine decodes HEVC streams into JPEG images.' },
          { step: 'Download JPG', text: 'Save high quality JPG photos usable on any platform or website.' },
        ],
        faqs: [
          { q: 'Is image quality lost when converting HEIC to JPG?', a: 'No, our encoder uses maximum quality preservation settings.' },
        ],
      }}
    />
  );
}
