import type { Metadata } from 'next';
import { generateMetadataConfig } from '@/lib/seo';

export const metadata: Metadata = generateMetadataConfig({
  title: 'Terms of use',
  description:
    'Terms for using FileProcessor: free tools, no warranty, do not upload unlawful content, files expire after 60 minutes.',
  path: '/terms',
  keywords: ['fileprocessor terms'],
});

export default function TermsPage() {
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="font-display text-3xl font-semibold text-ink dark:text-paper">Terms of use</h1>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        FileProcessor is provided as-is, without a warranty that a conversion will succeed or that
        output will match a specific size or quality. You are responsible for the files you upload
        and for having the right to process them.
      </p>
      <p className="text-sm leading-relaxed text-ink-muted dark:text-paper/70">
        Do not upload malware or content you are not allowed to copy. We may refuse or interrupt
        jobs that abuse the service. Processed files are temporary and are deleted after about 60
        minutes.
      </p>
    </article>
  );
}
