import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { HEICToJPGClient } from './HEICToJPGClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'HEIC to JPG Converter — Convert iPhone HEIC Photos Online',
  description: 'Convert Apple iPhone HEIC and HEIF photos to standard JPG format in high quality. Compatible across all devices.',
  path: '/heic-to-jpg',
  keywords: ['heic to jpg', 'convert heic to jpg', 'iphone photo converter', 'heif to jpg', 'heic converter online'],
});

export default function HEICToJPGPage() {
  return <HEICToJPGClient />;
}
