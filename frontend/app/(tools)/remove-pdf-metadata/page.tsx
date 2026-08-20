import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { RemovePDFMetadataClient } from './RemovePDFMetadataClient';


const tool = getToolByPath('/remove-pdf-metadata')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function RemovePDFMetadataPage() {
  return <RemovePDFMetadataClient />;
}
