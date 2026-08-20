import type { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Privacy',
  description:
    'How FileProcessor handles uploads: files are processed to complete your job and deleted after 60 minutes. No accounts.',
  path: '/privacy',
  keywords: ['fileprocessor privacy', 'file deletion'],
});

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">Privacy</h1>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        You can use FileProcessor without creating an account. We do not ask for your name or email to
        run a tool.
      </p>
      <h2 className="text-lg font-semibold text-ink dark:text-paper">Files</h2>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        When you upload a file, it is stored on the processing server long enough to run the job and
        let you download the result. A scheduled cleanup deletes expired files after 60 minutes.
        Anyone who has the job ID can download the result until it expires, so do not share that link
        if the file is private.
      </p>
      <h2 className="text-lg font-semibold text-ink dark:text-paper">Logs and hosting</h2>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        The host (for example Vercel for the site and the API host) may keep standard access logs such
        as IP address and user agent. We do not sell file contents. This page describes the product
        behavior; hosting providers have their own policies.
      </p>
    </article>
  );
}
