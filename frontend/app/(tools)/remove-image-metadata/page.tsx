import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { RemoveImageMetadataClient } from './RemoveImageMetadataClient';


const tool = getToolByPath('/remove-image-metadata')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function RemoveImageMetadataPage() {
  return <RemoveImageMetadataClient />;
}
