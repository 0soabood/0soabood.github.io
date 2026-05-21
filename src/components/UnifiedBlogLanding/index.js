import React, {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {BlogPostProvider} from '@docusaurus/plugin-content-blog/client';
import BlogPostItem from '@theme/BlogPostItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllPluginInstancesData} from '@docusaurus/useGlobalData';

const BLOG_PLUGIN_NAME = 'docusaurus-plugin-content-blog';

function slugFromPermalink(permalink) {
  const parts = permalink.replace(/\/$/, '').split('/');
  return parts[parts.length - 1] || 'post';
}

function getBlogCount(blogData, fallback) {
  if (typeof blogData?.blogPosts?.length === 'number') {
    return blogData.blogPosts.length;
  }
  return fallback;
}

function TimelineSidebar({items, isParrotBlog}) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const anchors = items
      .map((item) => {
        const id = slugFromPermalink(item.content.metadata.permalink);
        const el = document.getElementById(id);
        return el ? {id, el} : null;
      })
      .filter(Boolean);

    if (anchors.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      },
    );

    anchors.forEach(({el}) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({top: y, behavior: 'smooth'});
      setActiveId(id);
    }
  };

  if (items.length <= 1) return null;

  return (
    <aside className="blog-timeline">
      <div className="blog-timeline__header">
        <span className="blog-timeline__indicator" />
        <span className="blog-timeline__label">
          {isParrotBlog ? 'parrot@timeline:~$' : 'abood@timeline:~$'}
        </span>
      </div>
      <nav className="blog-timeline__nav">
        {items.map((item, idx) => {
          const id = slugFromPermalink(item.content.metadata.permalink);
          const title =
            item.content.metadata.title ||
            item.content.frontMatter?.title ||
            'Untitled';
          const isActive = id === activeId;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={clsx('blog-timeline__link', isActive && 'is-active')}>
              <span className="blog-timeline__dot" />
              <span className="blog-timeline__index">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="blog-timeline__title">{title}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
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

        <div className="unified-blog__layout">
          <TimelineSidebar items={items} isParrotBlog={isParrotBlog} />
          <main className="unified-blog__feed">
            {items.map(({content: BlogPostContent}) => {
              const id = slugFromPermalink(BlogPostContent.metadata.permalink);
              return (
                <div key={id} id={id} className="blog-post-anchor">
                  <BlogPostProvider
                    key={BlogPostContent.metadata.permalink}
                    content={BlogPostContent}>
                    <BlogPostItem>
                      <BlogPostContent />
                    </BlogPostItem>
                  </BlogPostProvider>
                </div>
              );
            })}
          </main>
        </div>
      </div>
    </Layout>
  );
}
