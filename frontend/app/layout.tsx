import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free PDF, Image & Video Utility Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'The fastest online utility platform to compress, convert, merge, split, resize, and process PDFs, Images, and Video files with zero quality loss and 100% privacy.',
  keywords: [
    'file processor',
    'online pdf tools',
    'compress pdf online',
    'compress image online',
    'video to audio converter',
    'mp4 to mp3',
    'heic to jpg',
    'merge pdf',
    'split pdf',
    'free online tools',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free PDF, Image & Video Utility Platform`,
    description:
      'The fastest online utility platform to compress, convert, merge, split, resize, and process PDFs, Images, and Video files with zero quality loss.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Free PDF, Image & Video Utility Platform`,
    description:
      'The fastest online utility platform to compress, convert, merge, split, resize, and process PDFs, Images, and Video files.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen flex flex-col bg-paper dark:bg-night text-ink dark:text-paper font-sans antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
