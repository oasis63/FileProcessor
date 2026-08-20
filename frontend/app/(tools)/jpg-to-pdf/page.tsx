import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { JPGToPDFClient } from './JPGToPDFClient';


const tool = getToolByPath('/jpg-to-pdf')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function JPGToPDFPage() {
  return <JPGToPDFClient />;
}
