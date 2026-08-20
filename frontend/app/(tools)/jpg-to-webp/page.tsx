import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { JPGToWebPClient } from './JPGToWebPClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'JPG to WebP Converter — Convert Photos to Next-Gen WebP',
  description: 'Convert JPG and PNG photos to high-performance WebP format for faster web page load speeds.',
  path: '/jpg-to-webp',
  keywords: ['jpg to webp', 'convert jpg to webp', 'png to webp', 'webp converter online'],
});

export default function JPGToWebPPage() {
  return <JPGToWebPClient />;
}
