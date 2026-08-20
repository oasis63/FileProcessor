import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { RemovePDFMetadataClient } from './RemovePDFMetadataClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Remove PDF Metadata Online — Strip Author, Title, and Tracking Data',
  description: 'Remove author, title, producer, and other metadata from PDF files before you share them.',
  path: '/remove-pdf-metadata',
  keywords: ['remove pdf metadata', 'strip pdf metadata', 'clean pdf', 'pdf privacy'],
});

export default function RemovePDFMetadataPage() {
  return <RemovePDFMetadataClient />;
}
