import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { CompressPDFClient } from './CompressPDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Compress PDF Online — Reduce PDF File Size Free',
  description: 'Shrink your PDF file size online while maintaining maximum font and visual readability. Target specific MB limits automatically.',
  path: '/compress-pdf',
  keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor online', 'shrink pdf', 'compress pdf to target size'],
});

export default function CompressPDFPage() {
  return <CompressPDFClient />;
}
