import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { RotatePDFClient } from './RotatePDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Rotate PDF Online — Turn PDF Pages 90, 180, or 270 Degrees',
  description: 'Rotate PDF pages clockwise or counterclockwise in seconds. Free online PDF rotator with no signup.',
  path: '/rotate-pdf',
  keywords: ['rotate pdf', 'turn pdf pages', 'pdf rotator', 'rotate pdf 90 degrees'],
});

export default function RotatePDFPage() {
  return <RotatePDFClient />;
}
