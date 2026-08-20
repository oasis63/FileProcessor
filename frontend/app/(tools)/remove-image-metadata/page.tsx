import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { RemoveImageMetadataClient } from './RemoveImageMetadataClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Remove Image Metadata Online — Strip EXIF and GPS from Photos',
  description: 'Remove EXIF, GPS location, and camera data from JPG, PNG, WebP, and HEIC photos before you share them.',
  path: '/remove-image-metadata',
  keywords: ['remove exif', 'strip image metadata', 'remove gps from photo', 'exif cleaner'],
});

export default function RemoveImageMetadataPage() {
  return <RemoveImageMetadataClient />;
}
