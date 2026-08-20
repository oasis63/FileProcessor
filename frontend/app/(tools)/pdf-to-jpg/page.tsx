import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { PDFToJPGClient } from './PDFToJPGClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'PDF to JPG Converter — Convert PDF Pages to Images',
  description: 'Convert PDF pages into high-resolution JPG images. Download converted pages instantly as a ZIP archive.',
  path: '/pdf-to-jpg',
  keywords: ['pdf to jpg', 'convert pdf to jpg', 'pdf to image', 'pdf to picture'],
});

export default function PDFToJPGPage() {
  return <PDFToJPGClient />;
}
