import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { SplitPDFClient } from './SplitPDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Split PDF Online — Extract Pages From PDF Documents',
  description: 'Separate PDF pages or extract individual pages into separate PDF files online.',
  path: '/split-pdf',
  keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf splitter online'],
});

export default function SplitPDFPage() {
  return <SplitPDFClient />;
}
