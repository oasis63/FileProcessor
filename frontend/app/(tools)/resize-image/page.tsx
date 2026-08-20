import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { ResizeImageClient } from './ResizeImageClient';


const tool = getToolByPath('/resize-image')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function ResizeImagePage() {
  return <ResizeImageClient />;
}
