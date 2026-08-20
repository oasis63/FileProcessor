import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeClient } from '@/components/home/HomeClient';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  generateFAQSchema,
  generateMetadataConfig,
  HOME_FAQS,
} from '@/lib/seo';
import { TOOL_CATALOG } from '@/lib/tools-catalog';

export const metadata: Metadata = generateMetadataConfig({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: '/',
  keywords: [
    'free pdf tools',
    'compress pdf online',
    'heic to jpg',
    'merge pdf',
    'mp4 to mp3',
    'compress image online',
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={generateFAQSchema(HOME_FAQS)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${SITE_NAME} tools`,
          numberOfItems: TOOL_CATALOG.length,
          itemListElement: TOOL_CATALOG.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.navTitle,
            url: absoluteUrl(tool.path),
          })),
        }}
      />
      <HomeClient />
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-ink dark:text-paper">How FileProcessor works</h2>
          <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
            FileProcessor is a free set of browser tools backed by a Go processing server. You upload a
            PDF, image, or video, choose options such as quality or output format, and download the
            result. Jobs run with Ghostscript, pdfcpu, ImageMagick, and FFmpeg. Temporary files are
            removed after 60 minutes. There is no account and no watermark.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-ink dark:text-paper">Popular tools</h2>
          <ul className="text-sm text-ink-muted dark:text-paper/70 space-y-2 list-disc pl-5">
            <li>
              <Link href="/compress-pdf" className="text-brand-700 dark:text-brand-300 underline">
                Compress PDF
              </Link>{' '}
              — shrink a PDF with a quality preset or a target size in megabytes.
            </li>
            <li>
              <Link href="/heic-to-jpg" className="text-brand-700 dark:text-brand-300 underline">
                HEIC to JPG
              </Link>{' '}
              — convert iPhone photos so they open on Windows and the web.
            </li>
            <li>
              <Link href="/video-to-audio" className="text-brand-700 dark:text-brand-300 underline">
                Video to MP3
              </Link>{' '}
              — extract audio from MP4, MOV, or MKV.
            </li>
            <li>
              <Link href="/merge-pdf" className="text-brand-700 dark:text-brand-300 underline">
                Merge PDF
              </Link>{' '}
              — combine several PDFs into one file.
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-ink dark:text-paper">Questions</h2>
          {HOME_FAQS.map((faq) => (
            <div key={faq.q} className="space-y-1">
              <h3 className="text-sm font-semibold text-ink dark:text-paper">{faq.q}</h3>
              <p className="text-sm text-ink-muted dark:text-paper/70 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
