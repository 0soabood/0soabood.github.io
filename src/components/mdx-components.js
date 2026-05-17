import React from 'react';
import { MDXProvider } from '@docusaurus/core';

const components = {
  // Custom components go here
  Callout: ({ children, type = 'info' }) => {
    const styles = {
      info: 'border-blue-500 bg-blue-50 text-blue-800',
      warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
      error: 'border-red-500 bg-red-50 text-red-800',
      success: 'border-green-500 bg-green-50 text-green-800',
    };

    return (
      <div className={`admonition ${type} border-l-4 p-4 rounded my-6`} style={{ borderLeftColor: styles[type].split(' ')[0].replace('border-', '') }}>
        <div className="admonition-title" style={{ marginBottom: '0.5rem', fontWeight: '600' }}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
        <div className="admonition-content">
          {children}
        </div>
      </div>
    );
  },
  // Add more custom components as needed
};

export default function CustomMDXProvider({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}