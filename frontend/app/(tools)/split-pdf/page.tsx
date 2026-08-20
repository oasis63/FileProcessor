import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { SplitPDFClient } from './SplitPDFClient';


const tool = getToolByPath('/split-pdf')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function SplitPDFPage() {
  return <SplitPDFClient />;
}
