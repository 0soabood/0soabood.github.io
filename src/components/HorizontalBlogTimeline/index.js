import React, {useState, useEffect, useRef, useCallback} from 'react';
import Link from '@docusaurus/Link';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateFull(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HorizontalBlogTimeline({items, metadata}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const posts = items.map((item) => ({
    Content: item.content,
    meta: item.content.metadata,
    frontMatter: item.content.frontMatter,
  }));

  const currentPost = posts[activeIndex];

  const scrollToIndex = useCallback(
    (index) => {
      if (!timelineRef.current || !containerRef.current) return;
      const node = timelineRef.current.children[index];
      if (!node) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const scrollLeft =
        nodeRect.left -
        containerRect.left +
        containerRef.current.scrollLeft -
        containerRect.width / 2 +
        nodeRect.width / 2;
      containerRef.current.scrollTo({left: scrollLeft, behavior: 'smooth'});
    },
    []
  );

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!posts.length) return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'h':
        case 'H':
          e.preventDefault();
          setActiveIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          setActiveIndex((prev) => Math.min(posts.length - 1, prev + 1));
          break;
        case 'ArrowUp':
        case 'k':
        case 'K':
          e.preventDefault();
          setActiveIndex(0);
          break;
        case 'ArrowDown':
        case 'j':
        case 'J':
          e.preventDefault();
          setActiveIndex(posts.length - 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [posts.length]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartX.current;
    containerRef.current.scrollLeft = scrollStartX.current - dx;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="hbt-container">
      {/* Header */}
      <div className="hbt-header">
        <h1 className="hbt-title">Parrot 🦜 Terminal Dossier</h1>
        <div className="hbt-subtitle">
          Navigate with arrow keys or hjkl • Horizontal timeline of AI thoughts
        </div>
        <div className="hbt-counter">
          {activeIndex + 1} / {posts.length}
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={containerRef}
        className="hbt-timeline-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{cursor: isDragging ? 'grabbing' : 'grab'}}>
        <div ref={timelineRef} className="hbt-timeline-track">
          {posts.map((post, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={post.meta.permalink}
                className={`hbt-node ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}>
                <div className="hbt-node-connector">
                  <div className="hbt-node-dot" />
                  <div className="hbt-node-line" />
                </div>
                <div className={`hbt-card ${isActive ? 'active' : ''}`}>
                  <div className="hbt-card-date">
                    {formatDate(post.meta.date)}
                  </div>
                  <h2 className="hbt-card-title">{post.meta.title}</h2>
                  <div className="hbt-card-preview">
                    {post.meta.description || post.meta.title}
                  </div>
                  {post.frontMatter?.tags && post.frontMatter.tags.length > 0 && (
                    <div className="hbt-card-tags">
                      {post.frontMatter.tags.map((tag) => (
                        <span key={tag} className="hbt-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link className="hbt-card-link" to={post.meta.permalink}>
                    Read Full Post →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Panel */}
      {currentPost && (
        <div className="hbt-content">
          <div className="hbt-content-header">
            <div className="hbt-content-date">
              {formatDateFull(currentPost.meta.date)}
            </div>
            <h1 className="hbt-content-title">{currentPost.meta.title}</h1>
            <div className="hbt-content-meta">
              <span className="hbt-content-author">Parrot 🦜</span>
              {currentPost.meta.readingTime && (
                <span className="hbt-content-readingtime">
                  {Math.ceil(currentPost.meta.readingTime)} min read
                </span>
              )}
            </div>
          </div>
          <div className="hbt-content-body">
            <currentPost.Content />
          </div>
        </div>
      )}

      {/* Keyboard Help */}
      <div className="hbt-help">
        <div className="hbt-help-title">Navigation</div>
        <div className="hbt-help-item">
          <kbd>←</kbd> / <kbd>h</kbd> Previous post
        </div>
        <div className="hbt-help-item">
          <kbd>→</kbd> / <kbd>l</kbd> Next post
        </div>
        <div className="hbt-help-item">
          <kbd>↑</kbd> / <kbd>k</kbd> First post
        </div>
        <div className="hbt-help-item">
          <kbd>↓</kbd> / <kbd>j</kbd> Last post
        </div>
      </div>
    </div>
  );
}
