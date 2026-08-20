import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://file-processor-six.vercel.app').replace(
  /\/$/,
  ''
);
export const SITE_NAME = 'FileProcessor';
export const SITE_TAGLINE = 'Free online PDF, image, and video tools';
export const SITE_DESCRIPTION =
  'Compress PDFs, convert HEIC to JPG, merge files, extract MP3 from video, and more. Free, no signup. Files are deleted automatically after 60 minutes.';

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  robotsIndex?: boolean;
}

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function generateMetadataConfig({
  title,
  description,
  path,
  keywords = [],
  robotsIndex = true,
}: SEOProps): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const ogImage = {
    url: '/opengraph-image',
    width: 1200,
    height: 630,
    alt: `${title} — ${SITE_NAME}`,
  };

  return {
    title: fullTitle,
    description,
    keywords: Array.from(
      new Set([
        'fileprocessor',
        'online file converter',
        'pdf tools',
        'image converter',
        'video to mp3',
        ...keywords,
      ])
    ),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'utilities',
    alternates: {
      canonical: url,
    },
    robots: robotsIndex
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/opengraph-image'],
    },
  };
}

export function generateWebApplicationSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${name} — ${SITE_NAME}`,
    description,
    url: absoluteUrl(path),
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'PDF compression and merge',
      'Image compression and conversion',
      'Video to audio extraction',
      'Automatic file deletion after 60 minutes',
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function generateHowToSchema(
  name: string,
  description: string,
  path: string,
  steps: Array<{ step: string; text: string }>
) {
  if (!steps?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    url: absoluteUrl(path),
    step: steps.map((item, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: item.step,
      text: item.text,
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['File Processor', 'FileProcessor online'],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl('/icon.svg'),
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/icon.svg'),
    description: SITE_DESCRIPTION,
  };
}

export const HOME_FAQS = [
  {
    q: 'Is FileProcessor free to use?',
    a: 'Yes. Every tool on FileProcessor is free. You do not create an account, and there is no watermark on the downloaded file.',
  },
  {
    q: 'Are my files kept on the server?',
    a: 'Uploads and results are stored only long enough to process and download. A cleanup job deletes files after 60 minutes.',
  },
  {
    q: 'What file types can I process?',
    a: 'PDFs; images including JPG, PNG, WebP, and HEIC; and video such as MP4, MOV, and MKV for audio extraction. Each tool lists the formats it accepts.',
  },
  {
    q: 'Do I need to install software?',
    a: 'No. Processing runs in the browser against a Go backend. You upload a file, wait for the job to finish, and download the result.',
  },
];
