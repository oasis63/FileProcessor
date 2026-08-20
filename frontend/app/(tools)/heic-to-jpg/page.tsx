import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { HEICToJPGClient } from './HEICToJPGClient';


const tool = getToolByPath('/heic-to-jpg')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function HEICToJPGPage() {
  return <HEICToJPGClient />;
}
