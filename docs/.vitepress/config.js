const getNav = require('./getNav')

const nav = getNav(true)
const sidebar = {}

for (let i = 0, len = nav.length, navItem; i < len; i++) {
  navItem = nav[i]

  if (!navItem.f) {
    sidebar[navItem.l] = getNav(false, '.' + navItem.l, navItem.l)
  }
}

/** @type {import('vitepress').UserConfig} */
module.exports = {
  lang: 'zh-CN',
  title: '玉书',
  description: '毛瑞的博客',
  head: [['link', { rel: 'icon', href: 'logo.jpg' }]],
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '玉书',
      description: '毛瑞的博客',
    },
  },
  serviceWorker: true,
  themeConfig: {
    repo: 'Maorey/Blog',
    docsDir: 'docs',
    docsBranch: 'master',

    logo: 'logo.jpg',
    editLinks: true,
    editLinkText: '编辑本文',
    lastUpdated: '上次更新',

    locales: {
      '/': { nav, sidebar },
    },

    algolia: {
      apiKey: 'STILL_WAIT_THE_EMAIL',
      indexName: 'blog',
    },
  },
  markdown: {
    lineNumbers: true,
    config: md => {
      md.use(require('markdown-it-sub'))
      md.use(require('markdown-it-sup'))
      md.use(require('markdown-it-ins'))
      md.use(require('markdown-it-abbr'))
      md.use(require('markdown-it-mark'))
      md.use(require('markdown-it-latex').default)
      md.use(require('markdown-it-katex'))
      md.use(require('markdown-it-deflist'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-img-lazy'))
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-link-attributes'), {
        pattern: /^https?:\/\//,
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      })

      md.use(require('./markdown/markdown-it-plugin-mermaid'))
      md.use(require('./markdown/markdown-it-plugin-echarts'))
      md.use(require('./markdown/markdown-it-plugin-flowchart'))

      const originalRender = md.render
      const REG_MATH_MUSTACHE_TAG = /<span class="katex">/g
      const replacer = '<span v-pre class="katex">'
      md.render = function () {
        return originalRender
          .apply(this, arguments)
          .replace(REG_MATH_MUSTACHE_TAG, replacer)
      }
    },
  },
}
