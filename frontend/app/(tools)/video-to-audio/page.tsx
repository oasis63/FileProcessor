import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { getToolByPath } from '@/lib/tools-catalog';

import { VideoToAudioClient } from './VideoToAudioClient';


const tool = getToolByPath('/video-to-audio')!;

export const metadata: Metadata = generateMetadataConfig({
  title: tool.metaTitle,
  description: tool.description,
  path: tool.path,
  keywords: tool.keywords,
});
export default function VideoToAudioPage() {
  return <VideoToAudioClient />;
}
