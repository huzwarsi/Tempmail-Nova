import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private HTML crawlable so search engines can see its noindex directive.
      // Data endpoints are excluded from discovery and also send X-Robots-Tag.
      disallow: ['/api/', '/socket.io/'],
    },
    sitemap: 'https://tempmailnova.com/sitemap.xml',
  };
}
