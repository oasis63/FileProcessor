export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://file-processor-six.vercel.app';
export const SITE_NAME = 'FileProcessor';

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}

export function generateMetadataConfig({ title, description, path, keywords = [] }: SEOProps) {
  const url = `${SITE_URL}${path}`;
  
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: [
      'file processor',
      'online file converter',
      'pdf tools',
      'image converter',
      'video to audio',
      ...keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export function generateWebApplicationSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${name} — ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs || faqs.length === 0) return null;

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
