import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { ProtectPDFClient } from './ProtectPDFClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Protect PDF Online — Encrypt PDF with Password',
  description: 'Encrypt your sensitive PDF files with strong password protection and AES encryption online.',
  path: '/protect-pdf',
  keywords: ['protect pdf', 'encrypt pdf', 'password protect pdf', 'secure pdf online'],
});

export default function ProtectPDFPage() {
  return <ProtectPDFClient />;
}
