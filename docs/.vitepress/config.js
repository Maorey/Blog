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
  head: [['link', { rel: 'icon', href: '/logo.jpg' }]],
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
      apiKey: 'rejected',
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
      md.use(require('markdown-it-katex'))
      md.use(require('markdown-it-latex').default)
      md.use(require('markdown-it-deflist'))
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-img-lazy'))
      md.use(require('markdown-it-task-lists'))
      md.use(require('markdown-it-html5-media').html5Media, {
        messages: {
          en: {
            'html5 video not supported': '你的设备不支持播放该视频',
            'html5 audio not supported': '你的设备不支持播放该音频',
            'html5 media fallback link': '<a href="%s" download>下载该文件</a>',
            'html5 media description': '%s',
          },
        },
      })
      // md.use(require('markdown-it-link-attributes'), {
      //   pattern: /^https?:\/\//,
      //   attrs: {
      //     target: '_blank',
      //     rel: 'noopener noreferrer',
      //   },
      // })

      md.use(require('./markdown/markdown-it-echarts'))
      md.use(require('./markdown/markdown-it-mermaid'))
      md.use(require('./markdown/markdown-it-flowchart'))

      const REG_MATH_MUSTACHE_TAG = /<span class="katex">/g
      const replacer = '<span v-pre class="katex">'
      const originalRender = md.render
      md.render = function () {
        return originalRender.apply(this, arguments).replace(REG_MATH_MUSTACHE_TAG, replacer)
      }
    },
  },
}
