import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { CropImageClient } from './CropImageClient';


const tool = getToolByPath('/crop-image')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function CropImagePage() {
  return <CropImageClient />;
}
