import { Theme, inBrowser } from 'vitepress'

import Layout from './App.vue'
import NotFound from './components/NotFound.vue'
import Menu from './components/Menu.vue'

export default {
  Layout,
  NotFound, // () => '啥都没得', // <- this is a Vue 3 functional component
  enhanceApp({ app }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('Nfd', NotFound)
    app.component('Menu', Menu)

    // 自定义标签 如数学公式
    // const CUSTOM_TAGS = new Set([
    //   'math',
    //   'semantics',
    //   'mrow',
    //   'msub',
    //   'msuo',
    //   'mo',
    //   'mi',
    //   'mn',
    //   'annotation',
    // ])
    // const originalIsCustomElement = app.config.isCustomElement
    // app.config.isCustomElement = function (tag) {
    //   return (
    //     (originalIsCustomElement && originalIsCustomElement.apply(this, arguments)) ||
    //     CUSTOM_TAGS.has(tag)
    //   )
    // }
    if (!inBrowser) {
      app.config.isCustomElement = () => true
      app.config.errorHandler = () => {}
    }
  },
} as Theme
