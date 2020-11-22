const getNav = require('./getNav')

const nav = getNav(true)
const sidebar = {}

for (let i = 0, len = nav.length, navItem; i < len; i++) {
  navItem = nav[i]

  if (!navItem.f) {
    sidebar[navItem.l] = getNav(false, '.' + navItem.l, navItem.l)
  }
}

/** @typedef {import('vitepress').UserConfig} UserConfig */

/** @type {UserConfig['head']} */
const head = [['link', { rel: 'icon', href: `/logo.jpg` }]]

/** @type {UserConfig} */
module.exports = {
  lang: 'zh-CN',
  title: '玉书',
  description: '毛瑞的博客',
  head,
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
    docsRepo: 'Maorey/Blog',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,

    locales: {
      '/': { nav, sidebar },
    },

    // algolia: {
    //   apiKey: '07ed552fc16926cc57c9eb0862c1a7f9',
    //   indexName: 'next_router_vuejs',
    //   algoliaOptions: { facetFilters: ['tags:guide,api'] },
    // },
  },
}
