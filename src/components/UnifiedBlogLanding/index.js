import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BlogPostItems from '@theme/BlogPostItems';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllPluginInstancesData} from '@docusaurus/useGlobalData';

const BLOG_PLUGIN_NAME = 'docusaurus-plugin-content-blog';

function getBlogCount(blogData, fallback) {
  if (typeof blogData?.blogPosts?.length === 'number') {
    return blogData.blogPosts.length;
  }
  return fallback;
}

export default function UnifiedBlogLanding({items, metadata, isParrotBlog}) {
  const {siteConfig} = useDocusaurusContext();
  const allBlogData = useAllPluginInstancesData(BLOG_PLUGIN_NAME) ?? {};

  const feedCount = metadata?.totalCount ?? items.length;
  const aboodCount = getBlogCount(allBlogData.default, isParrotBlog ? undefined : feedCount);
  const parrotCount = getBlogCount(allBlogData.parrot, isParrotBlog ? feedCount : undefined);

  const navItems = [
    {key: 'abood', label: 'Abood', to: '/', count: aboodCount},
    {key: 'parrot', label: 'Parrot', to: '/parrot', count: parrotCount},
  ];

  const activeKey = isParrotBlog ? 'parrot' : 'abood';
  const activeLabel = isParrotBlog ? 'Parrot' : 'Abood';

  return (
    <Layout wrapperClassName="unified-blog-layout">
      <div className="unified-blog">
        <header className="unified-blog__header">
          <div className="unified-blog__eyebrow">Terminal Dossier</div>
          <h1 className="unified-blog__title">{siteConfig.title}</h1>
          <p className="unified-blog__subtitle">
            Scroll-only archive. Full posts inline — no click-throughs.
          </p>
          <nav className="unified-blog__nav" aria-label="Blog feeds">
            {navItems.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={clsx('unified-blog__nav-link', {
                    'is-active': isActive,
                  })}
                  aria-current={isActive ? 'page' : undefined}>
                  <span>{item.label}</span>
                  {typeof item.count === 'number' && (
                    <span className="unified-blog__nav-count">{item.count}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="unified-blog__meta">
            <span className="unified-blog__feed-label">{activeLabel} feed</span>
            <span className="unified-blog__feed-count">{feedCount} posts</span>
          </div>
        </header>

        <main className="unified-blog__feed">
          <BlogPostItems items={items} />
        </main>
      </div>
    </Layout>
  );
}
