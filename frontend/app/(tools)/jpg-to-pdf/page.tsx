import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { JPGToPDFClient } from './JPGToPDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'JPG to PDF Converter — Convert Images to PDF Document',
  description: 'Convert JPG, PNG, and WebP images into a single professional PDF document in seconds.',
  path: '/jpg-to-pdf',
  keywords: ['jpg to pdf', 'convert image to pdf', 'picture to pdf', 'photos to pdf'],
});

export default function JPGToPDFPage() {
  return <JPGToPDFClient />;
}
