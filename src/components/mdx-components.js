import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXProvider } from '@docusaurus/core';

const components = {
  // Custom components go here
  Callout: ({ children, type = 'info' }) => {
    const styles = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    };

    return (
      <div className={`callout ${styles[type]} border-l-4 p-4 rounded-r my-6`}>
        {children}
      </div>
    );
  },
  CodeBlock: ({ children, language = 'text', title, lineNumbers = false }) => {
    const langMap = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      sh: 'bash',
      css: 'css',
      html: 'html',
      json: 'json',
      md: 'markdown',
      default: 'text',
    };

    const lang = langMap[language] || language || 'text';

    return (
      <div className="code-block my-6">
        {title && (
          <div className="code-title text-sm font-semibold text-gray-500 mb-2">
            {title}
          </div>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-gray-400 text-xs">
            {lineNumbers && '1'}
          </div>
          <pre className="language-{lang}"><code>{children}</code></pre>
        </div>
      </div>
    );
  },
  // Add more custom components as needed
};

export default function CustomMDXProvider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}