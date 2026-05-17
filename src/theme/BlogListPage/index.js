import React from 'react';
import BlogListPage from '@theme-original/BlogListPage';
import HorizontalBlogTimeline from '@site/src/components/HorizontalBlogTimeline';

export default function BlogListPageWrapper(props) {
  // Check if this is the parrot blog list page
  const isParrotBlog = props.metadata?.permalink?.startsWith('/parrot');

  if (isParrotBlog) {
    return <HorizontalBlogTimeline items={props.items} metadata={props.metadata} />;
  }

  return <BlogListPage {...props} />;
}
