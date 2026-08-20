import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { PDFToJPGClient } from './PDFToJPGClient';


const tool = getToolByPath('/pdf-to-jpg')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function PDFToJPGPage() {
  return <PDFToJPGClient />;
}
