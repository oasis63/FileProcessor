import React from 'react';
import Link from 'next/link';
import { BrandLockup } from './BrandMark';

export function Footer() {
  const link = 'hover:text-brand-700 dark:hover:text-brand-300';

  return (
    <footer className="border-t border-paper-line dark:border-night-border bg-paper-muted/60 dark:bg-night text-ink-muted dark:text-paper/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3 md:col-span-1">
            <BrandLockup />
            <p className="text-sm leading-relaxed max-w-xs">
              A small workshop for PDFs, photos, and audio. Files stay on the server for one hour, then they are deleted.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-ink dark:text-paper mb-3 text-xs uppercase tracking-widest">PDF</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/compress-pdf" className={link}>Compress</Link></li>
              <li><Link href="/merge-pdf" className={link}>Merge</Link></li>
              <li><Link href="/split-pdf" className={link}>Split</Link></li>
              <li><Link href="/rotate-pdf" className={link}>Rotate</Link></li>
              <li><Link href="/protect-pdf" className={link}>Protect</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink dark:text-paper mb-3 text-xs uppercase tracking-widest">Images</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/compress-image" className={link}>Compress</Link></li>
              <li><Link href="/resize-image" className={link}>Resize</Link></li>
              <li><Link href="/jpg-to-webp" className={link}>JPG to WebP</Link></li>
              <li><Link href="/heic-to-jpg" className={link}>HEIC to JPG</Link></li>
              <li><Link href="/remove-image-metadata" className={link}>Strip metadata</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-ink dark:text-paper mb-3 text-xs uppercase tracking-widest">Media</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/video-to-audio" className={link}>Video to audio</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-paper-line dark:border-night-border text-xs text-ink-faint">
          © {new Date().getFullYear()} FileProcessor. Processed files are removed automatically after 60 minutes.
        </div>
      </div>
    </footer>
  );
}
