import type { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';

export const metadata: Metadata = generateMetadataConfig({
  title: 'About FileProcessor',
  description:
    'FileProcessor is a free online toolkit for PDFs, images, and video. Processing runs on a Go server. Files are deleted after 60 minutes.',
  path: '/about',
  keywords: ['about fileprocessor', 'online pdf tools'],
});

export default function AboutPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">About FileProcessor</h1>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        FileProcessor is a small set of utilities for everyday file jobs: compressing a PDF so it fits
        an upload limit, converting an iPhone HEIC photo to JPEG, merging documents, or pulling MP3
        audio out of a video. The site is free and does not require an account.
      </p>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        The browser talks to a Go API. PDF work uses Ghostscript and pdfcpu. Images use ImageMagick.
        Audio extraction uses FFmpeg. Uploads are stored only for processing and download, then removed
        by a cleanup job after 60 minutes.
      </p>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        FileProcessor is not a backup service and is not intended for files that must remain
        confidential after you close the tab. If a document is highly sensitive, process it on a
        machine you control.
      </p>
    </article>
  );
}
