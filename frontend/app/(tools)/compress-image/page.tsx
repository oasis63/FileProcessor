import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { CompressImageClient } from './CompressImageClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Compress Image Online — Reduce JPG, PNG, WebP & HEIC Size',
  description: 'Intelligently compress JPG, PNG, WebP, and HEIC images without losing visible quality. Fast drag and drop image compressor.',
  path: '/compress-image',
  keywords: ['compress image', 'image compressor', 'reduce photo size', 'compress jpg', 'compress png', 'compress webp'],
});

export default function CompressImagePage() {
  return <CompressImageClient />;
}
