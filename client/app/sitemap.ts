import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '../lib/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tempmailnova.com';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/how-it-works',
    '/privacy',
    '/terms',
    '/cookies',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated ?? post.published,
  }));

  return [...staticRoutes, ...blogRoutes];
}
