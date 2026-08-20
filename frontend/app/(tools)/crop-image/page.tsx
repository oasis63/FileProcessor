import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { CropImageClient } from './CropImageClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Crop Image Online — Free Online Photo Cropper',
  description: 'Crop rectangular regions from your JPG, PNG, and WebP images quickly and easily directly in your browser.',
  path: '/crop-image',
  keywords: ['crop image', 'image cropper', 'crop photo online', 'cut image', 'crop picture'],
});

export default function CropImagePage() {
  return <CropImageClient />;
}
