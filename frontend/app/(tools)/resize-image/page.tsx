import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { ResizeImageClient } from './ResizeImageClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Resize Image Online — Change Image Resolution & Dimensions',
  description: 'Resize image dimensions for Instagram, LinkedIn, Facebook, or Web. Custom pixel width and height presets.',
  path: '/resize-image',
  keywords: ['resize image', 'image resizer', 'change image dimensions', 'resize photo online', 'resize photo for instagram'],
});

export default function ResizeImagePage() {
  return <ResizeImageClient />;
}
