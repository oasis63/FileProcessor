import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { JPGToWebPClient } from './JPGToWebPClient';


const tool = getToolByPath('/jpg-to-webp')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function JPGToWebPPage() {
  return <JPGToWebPClient />;
}
