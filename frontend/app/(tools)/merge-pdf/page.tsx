import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { MergePDFClient } from './MergePDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Merge PDF Files Online — Combine PDFs Into One File',
  description: 'Combine multiple PDF documents into a single unified PDF file in seconds. Simple, private, and free.',
  path: '/merge-pdf',
  keywords: ['merge pdf', 'combine pdf files', 'join pdf', 'merge pdf online', 'pdf joiner'],
});

export default function MergePDFPage() {
  return <MergePDFClient />;
}
