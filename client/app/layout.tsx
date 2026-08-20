import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { InboxProvider } from '../context/InboxContext';
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
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#05080d',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tempmailnova.com'),
  alternates: {
    canonical: 'https://tempmailnova.com',
  },
  title: {
    default: 'Temp Mail – Free Temporary Email Generator | TempMail Nova',
    template: '%s | TempMail Nova',
  },
  description:
    'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails, OTPs and notifications in a disposable inbox without registration.',
  keywords: [
    'tempmail',
    'temp mail',
    'temporary email',
    'temporary email address',
    'disposable email',
    'disposable email address',
    'temp email',
    'free temp mail',
    'temporary mail',
    'throwaway email',
    'temporary inbox',
    'free disposable email',
  ],
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
    title: 'Temp Mail – Free Temporary Email Generator | TempMail Nova',
    description:
      'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails, OTPs and notifications in a disposable inbox without registration.',
    images: [
      {
        url: 'https://tempmailnova.com/logo.png',
        width: 512,
        height: 512,
        alt: 'TempMail Nova Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temp Mail – Free Temporary Email Generator | TempMail Nova',
    description: 'Generate a free temporary email address instantly with TempMail Nova. Receive verification emails and OTPs without registration.',
    images: ['https://tempmailnova.com/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <head>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#05080d] dark:text-slate-100 font-manrope transition-colors duration-200 selection:bg-emerald-500 selection:text-slate-950 min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <InboxProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </InboxProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
