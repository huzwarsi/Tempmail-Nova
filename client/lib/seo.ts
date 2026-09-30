import type { Metadata } from 'next';

export const SITE_URL = 'https://tempmailnova.com';
export const HOME_TITLE = 'Temp Mail - Free Temporary & Disposable Email | TempMail Nova';
export const HOME_DESCRIPTION = 'Create a free temporary email address in seconds. Receive verification emails without exposing your personal inbox. No signup required.';
export function publicMetadata(path: string, title: string, description: string): Metadata {
  const url = SITE_URL + path;
  const fullTitle = title.includes('TempMail Nova') ? title : title + ' | TempMail Nova';
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: fullTitle, description, siteName: 'TempMail Nova', locale: 'en_US', images: [{ url: SITE_URL + '/og-image.png', width: 1200, height: 630, alt: 'TempMail Nova - free temporary email, no signup required' }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [SITE_URL + '/og-image.png'] },
  };
}

