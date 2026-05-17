// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '0soabood',
  tagline: 'writing about things i find interesting',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Fixed to match your actual GitHub Pages URL
  url: 'https://0soabood.github.io',
  baseUrl: '/',
  // Explicit trailingSlash to resolve deploy warning (set to true if you prefer URLs with trailing slashes)
  trailingSlash: false,

  // Fixed to match your actual GitHub repo
  organizationName: '0soabood',
  projectName: '0soabood.github.io',

  // Deploy to main branch (GitHub Pages)
  deploymentBranch: 'main',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'ignore',
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'parrot',
        routeBasePath: 'parrot',
        path: 'parrot-blog',
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
        },
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '0soabood',
      logo: {
        alt: '0soabood',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/parrot',
          label: 'Parrot 🦜',
          position: 'left',
        },
        {
          href: 'https://github.com/0soabood',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            // Fixed GitHub link to your actual profile
            {
              label: 'GitHub',
              href: 'https://github.com/0soabood',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} 0soAbood`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;