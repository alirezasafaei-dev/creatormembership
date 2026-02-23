import type { Metadata } from 'next';
import { getWebBaseUrl, siteDescription, siteName } from './site';

export function buildDefaultMetadata(): Metadata {
  const siteUrl = getWebBaseUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: '%s | AsDev',
    },
    description: siteDescription,
    keywords: [
      'اشتراک کریتور',
      'عضویت ماهانه',
      'پرداخت آنلاین',
      'پرداخت idpay',
      'creator economy',
      'local-first membership',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      url: siteUrl,
      title: siteName,
      description: siteDescription,
      siteName,
      images: [
        {
          url: '/favicon.svg',
          width: 512,
          height: 512,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
      images: ['/favicon.svg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    icons: {
      icon: '/favicon.svg',
    },
    manifest: '/manifest.webmanifest',
  };
}

export function generateWebSiteSchema() {
  const siteUrl = getWebBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: 'fa-IR',
  };
}

export function generateOrganizationSchema() {
  const siteUrl = getWebBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description: 'سرویس عضویت برای کریتورهای فارسی‌زبان با زیرساخت مقاوم و local-first.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'support',
      areaServed: 'IR',
    },
  };
}

export function generateCreatorSchema(input: {
  slug: string;
  displayName: string;
  description: string;
}) {
  const siteUrl = getWebBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.displayName,
    description: input.description,
    url: `${siteUrl}/creators/${encodeURIComponent(input.slug)}`,
  };
}
