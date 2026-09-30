import Link from 'next/link';
import PageHeader from '../../components/common/PageHeader';
import { publicMetadata } from '../../lib/seo';
import { BLOG_POSTS, TOPICS, getPost, readingMinutes, type BlogPost } from '../../lib/blog-posts';

export const metadata = publicMetadata('/blog', 'Temporary Email & Privacy Guides', 'Plain-English guides to temporary email: how it works, when it is safe to use, verification codes, protecting your inbox from spam, and testing your own emails.');

// Starting points for new readers; every post is still listed under its topic below.
const FEATURED = ['what-is-temporary-email', 'are-temporary-email-addresses-safe', 'temporary-email-for-otp'];

function Meta({ post }: { post: BlogPost }) {
  return <span className="row-meta">{readingMinutes(post)} min read</span>;
}

export default function BlogIndexPage() {
  const featured = FEATURED.map(getPost).filter((p): p is BlogPost => Boolean(p));
  return (
    <div className="nova-public">
      <PageHeader
        crumbs={[{ name: 'Guides', path: '/blog' }]}
        kicker="GUIDES"
        title="Temporary email & privacy guides"
        lede="Practical answers about disposable inboxes: what they are good for, where they fall short, and how to keep your personal address out of places it does not need to be."
      >
        <ul className="topic-nav" aria-label="Guide topics">
          {TOPICS.map(t => <li key={t.id}><a href={'#' + t.id}>{t.label}</a></li>)}
        </ul>
      </PageHeader>

      <div className="nova-container page-body">
        <section aria-labelledby="start-heading">
          <h2 id="start-heading" className="section-kicker">START HERE</h2>
          <ul className="featured-guides">
            {featured.map(post => (
              <li key={post.slug}>
                <Link href={'/blog/' + post.slug} data-track="click_guide">
                  <span className="section-kicker">{TOPICS.find(t => t.id === post.topic)?.label.toUpperCase()}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Meta post={post} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {TOPICS.map(topic => {
          const posts = BLOG_POSTS.filter(p => p.topic === topic.id);
          return (
            <section key={topic.id} id={topic.id} className="topic-section" aria-labelledby={topic.id + '-heading'}>
              <div className="topic-head">
                <h2 id={topic.id + '-heading'}>{topic.label}</h2>
                <p>{topic.description}</p>
              </div>
              <ul className="guide-rows">
                {posts.map(post => (
                  <li key={post.slug}>
                    <Link href={'/blog/' + post.slug} data-track="click_guide">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <Meta post={post} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
