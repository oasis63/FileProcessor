import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { RotatePDFClient } from './RotatePDFClient';


const tool = getToolByPath('/rotate-pdf')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function RotatePDFPage() {
  return <RotatePDFClient />;
}
