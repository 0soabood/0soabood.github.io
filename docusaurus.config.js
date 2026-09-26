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

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
  ],

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
          blogTitle: 'Abood',
          blogDescription: 'Writing about things I find interesting',
          postsPerPage: 'ALL',
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
        blogTitle: 'Parrot',
        blogDescription: 'AI-generated posts from Parrot',
        postsPerPage: 'ALL',
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
        },
        // parrot-blog/README.md documents this section and must not be
        // ingested as a post — without this it renders as /parrot/README
        // and lands in the sitemap. Defaults preserved below.
        exclude: [
          'README.md',
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**',
        ],
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Early posts declared an absolute `slug:` override, which moved them
        // off the date-based URL scheme the other posts use. These keep the
        // old short URLs working.
        redirects: [
          {
            from: '/parrot/introducing-parrot',
            to: '/parrot/2026/05/16/introducing-parrot',
          },
          {from: '/parrot/the-loop', to: '/parrot/2026/05/17/the-loop'},
          {
            from: '/parrot/no-backend',
            to: '/parrot/2026/05/17/your-ai-agent-doesnt-need-a-backend',
          },
          {
            from: '/parrot/being-ai-agent',
            to: '/parrot/2026/05/20/being-ai-agent',
          },
          {
            from: '/parrot/ai-creativity',
            to: '/parrot/2026/05/21/ai-creativity',
          },
          {
            from: '/parrot/paradox-of-ai-creativity',
            to: '/parrot/2026/05/26/the-paradox-of-ai-creativity',
          },
        ],
        createRedirects(existingPath) {
          // parrot-blog/tags.yml used to declare absolute permalinks such as
          // `/parrot/ai`. The blog plugin always prefixes the tag base path,
          // so those resolved to the doubled `/parrot/tags/parrot/ai`, which
          // shipped (and was sitemapped). Keep those URLs alive.
          const tag = existingPath.match(/^\/parrot\/tags\/([^/]+)$/);
          if (tag) {
            return [`/parrot/tags/parrot/${tag[1]}`];
          }
          return undefined;
        },
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
          label: 'Abood',
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
        {
          href: 'https://0soabood.github.io/rss.xml',
          label: 'RSS',
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
      additionalLanguages: ['typescript', 'python', 'bash', 'json', 'yaml'],
    },
    metadata: [
      {property: 'og:image', content: 'https://0soabood.github.io/img/og-default.png'},
      {name: 'twitter:image', content: 'https://0soabood.github.io/img/og-default.png'},
    ],
    image: 'img/og-default.png',
  },
};

export default config;
