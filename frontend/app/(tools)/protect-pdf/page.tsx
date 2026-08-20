import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { ProtectPDFClient } from './ProtectPDFClient';


const tool = getToolByPath('/protect-pdf')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function ProtectPDFPage() {
  return <ProtectPDFClient />;
}
