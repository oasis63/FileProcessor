'use client';

import React from 'react';
import { ToolLayout } from '@/components/tool/ToolLayout';

export function RemoveImageMetadataClient() {
  return (
    <ToolLayout
      toolId="remove-image-metadata"
      title="Remove Image Metadata"
      description="Strip EXIF, GPS, and camera data from photos before you share them."
      accept="image/*,.heic"
      seoContent={{
        howItWorks: [
          { step: 'Upload photo', text: 'Drop a JPG, PNG, WebP, or HEIC file.' },
          { step: 'Strip tags', text: 'We rewrite the image without EXIF and GPS metadata.' },
          { step: 'Download', text: 'Save a shareable copy that does not leak location or camera details.' },
        ],
        faqs: [
          { q: 'Does this reduce image quality?', a: 'Pixels stay the same. Only metadata tags are removed.' },
        ],
      }}
    />
  );
}
