import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { CompressPDFClient } from './CompressPDFClient';


const tool = getToolByPath('/compress-pdf')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function CompressPDFPage() {
  return <CompressPDFClient />;
}
