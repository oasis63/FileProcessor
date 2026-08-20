import { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';
import { VideoToAudioClient } from './VideoToAudioClient';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Video to Audio Converter — Extract MP3 from Video Online',
  description: 'Extract high-quality MP3, WAV, or AAC audio from MP4, MOV, MKV, and WEBM video files instantly. Fast, free, and secure online media converter.',
  path: '/video-to-audio',
  keywords: ['video to audio', 'extract audio from video', 'mp4 to mp3', 'mov to mp3', 'convert video to mp3', 'audio extractor online'],
});

export default function VideoToAudioPage() {
  return <VideoToAudioClient />;
}
