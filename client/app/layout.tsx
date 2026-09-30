import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { InboxProvider } from '../context/InboxContext';
import ProductAnalytics from '../components/common/ProductAnalytics';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { WebSiteJsonLd, OrganizationJsonLd } from '../lib/structured-data';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  preload: false,
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tempmailnova.com'),
  verification: {
    google: '9-59SHpJxsS8Z5gGw7n3VC75qEyWGngBkeq_VAPlN00',
  },
  title: {
    default: 'Temp Mail | Free Temporary Email Generator',
    template: '%s',
  },
  description:
    'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails, OTPs and notifications in a disposable inbox without registration.',
  authors: [{ name: 'TempMail Nova Team' }],
  creator: 'TempMail Nova',
  publisher: 'TempMail Nova',
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
    url: 'https://tempmailnova.com',
    siteName: 'TempMail Nova',
    title: 'Temp Mail | Free Temporary Email Generator',
    description:
      'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails, OTPs and notifications in a disposable inbox without registration.',
    images: [
      {
        url: 'https://tempmailnova.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TempMail Nova — Free Temporary Email Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temp Mail | Free Temporary Email Generator',
    description: 'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails and OTPs without registration.',
    images: ['https://tempmailnova.com/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '48x48' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preserve the existing GA4 property; local QA does not pollute production data. */}
        {process.env.NODE_ENV === 'production' && <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J8FT80QMWD"
          strategy="afterInteractive"
        />}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Consent Mode v2: no ads on this site, so ad signals stay off everywhere.
            // Analytics cookies stay off in the EEA, UK and Switzerland until a consent tool is added.
            gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
            gtag('consent', 'default', { analytics_storage: 'denied', region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'] });
            gtag('js', new Date());
            if (location.hostname === 'tempmailnova.com' || location.hostname === 'www.tempmailnova.com') {
              gtag('config', 'G-J8FT80QMWD', { page_location: location.origin + location.pathname });
            }
          `}
        </Script>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="bg-white text-slate-900 dark:bg-[#05080d] dark:text-slate-100 font-manrope transition-colors duration-200 selection:bg-emerald-500 selection:text-slate-950 min-h-screen flex flex-col" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ProductAnalytics />
        <ThemeProvider>
          <AuthProvider>
            <InboxProvider>
              <Navbar />
              <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
              <Footer />
            </InboxProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
